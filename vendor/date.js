var EODateParser = (function(Date,undefined) {
    var pad = function(s) {
        return (s.toString().length === 1) ? "0" + s: s;
    };

	var checkerValue = function(target, func, value) {
		if (typeof value !== "undefined") {
		 	target[func](value);
		}
		
		return target;
	}
	
	var returnObj = {
		
		"stringify" : function(self, format) {

		 	if (!format || !self || format === "" || !format.replace) {
		 	  return null;
		 	}

	    	return format.replace(
				/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?/g, 
				function(format) {
				    switch (format) {
				    case "hh":
				        return pad(self.getUTCHours() < 13 ? self.getUTCHours() : (self.getUTCHours() - 12));
				    case "h":
				        return self.getUTCHours() < 13 ? self.getUTCHours() : (self.getUTCHours() - 12);
				    case "HH":
				        return pad(self.getUTCHours());
				    case "H":
				        return self.getUTCHours();
				    case "mm":
				        return pad(self.getUTCMinutes());
				    case "m":
				        return self.getUTCMinutes();
				    case "ss":
				        return pad(self.getUTCSeconds());
				    case "s":
				        return self.getUTCSeconds();
				    case "yyyy":
				        return self.getUTCFullYear();
				    case "yy":
				        return self.getUTCFullYear().toString().substring(2, 4);
				    case "dd":
				        return pad(self.getUTCDate());
				    case "d":
				        return self.getUTCDate().toString();
				    case "MM":
				        return pad((self.getUTCMonth() + 1));
				    case "M":
				        return self.getUTCMonth() + 1;
					default:
						return "";
				    }
				}
			);
	    },
	
		"parser" : function(input, format , returnDate) {
		  if (!format || !input || input === "" || format === "" || !input.match || !format.replace) {
			return null;
		  }
		

		  var parts = input.match(/(\d+)/g);
		  if (parts == null) {
			return null;
		  }
		  var i = 0;
		  var fmt = {};

		  // extract date-part indexes from the format
		  format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?/g, function(part) { 
			fmt[part] = i++; 
		  });

		  if (!returnDate) {
			returnDate = new Date(0,0,0,0,0,0,0);
		  }
		
		  //todo: hh / h / yy
		
		  checkerValue(returnDate , "setUTCFullYear" ,  parts[fmt['yyyy']]);
		  checkerValue(returnDate , "setUTCMonth"    ,  (parts[fmt['MM']] ? parts[fmt['MM']] - 1 : undefined));
		  checkerValue(returnDate , "setUTCMonth"    ,  (parts[fmt['M']] ? parts[fmt['M']] - 1 : undefined));
		  checkerValue(returnDate , "setUTCDate"     ,  parts[fmt['dd']]);
		  checkerValue(returnDate , "setUTCDate"     ,  parts[fmt['d']]);
		  checkerValue(returnDate , "setUTCHours"    ,  parts[fmt['HH']]);
		  checkerValue(returnDate , "setUTCHours"    ,  parts[fmt['H']]);
		  checkerValue(returnDate , "setUTCMinutes"  ,  parts[fmt['mm']]);
		  checkerValue(returnDate , "setUTCMinutes"  ,  parts[fmt['m']]);
		  checkerValue(returnDate , "setUTCSeconds"  ,  parts[fmt['ss']]);
		  checkerValue(returnDate , "setUTCSeconds"  ,  parts[fmt['s']]);

		  return returnDate;

		}
		
		
	}

	//sugar / monkey patch
	if (!Date.prototype.formatedString) {
		Date.prototype.formatedString = function(format) {
			return returnObj.stringify(this, format);
		}
	}
	
	if (!Date.parserString) {
		Date.parserString = returnObj.parser;
	}
	
	if (!Date.prototype.parserString) {
		Date.prototype.parserString = function(input, format) {
			return returnObj.parser(input, format, this);
		};
	}
	
	return returnObj;
})(Date);