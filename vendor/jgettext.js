(function(global, window, defaultLanguage, undefined) {

	var lang = {};

	/* Ensure language code is in the format aa-AA. */
	var normaliseLang = function(lang) {
		lang = lang.replace(/_/, '-').toLowerCase();
		if (lang.length > 3) {
			lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
		}
		return lang;
	};


	var loc = (typeof navigator !== 'undefined') ? 
		normaliseLang(navigator.language /* Mozilla */ || navigator.userLanguage /* IE */) : 
		defaultLanguage;
	
	
	// var find = function(arr,terms) {
	// 	var result = null;
		// try {
		// 		//ordened for
		// 		for (var x = terms.length, i = 0;  i < x; i++){
		// 			terms[i]
		// 		};
		// 		
		// 		for (var i=0; i < terms.length; i++) {
		// 			if (i == 0)
		// 				result = arr[terms[i]];
		// 			else
		// 				result = result[terms[i]];
		// 
		// 		};
		// 	} catch(err) {
		// 		result = null;
		// 	}
	// 	
	// 	return result;
	// };

	//todo move this to pre-process and to sqllite
	var cache;
	
	function each(obj, callback) {
		if (Array.isArray(obj)) {
			for (var i = 0; i < obj.length; i++) {
				if (callback.call(obj[i], i, obj[i]) === false) break;
			}
		} else if (obj && typeof obj === 'object') {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (callback.call(obj[key], key, obj[key]) === false) break;
				}
			}
		}
	}

	function cacherize(arr, parent) {
	   each(arr, function(k,v) {
	      var k = (parent ? parent+".": '')+k;
	      cache[k] = v;
	      if (typeof v == "object" && !(v instanceof Array)) {
	          cacherize(v, k);
	      }
	    });
	}

	

	var getText = function(text) {
		if (!cache) {
			cache = {};
			cacherize(lang);
		}
		
		// var check = cache[text];
		// 		if (check) {
		// 			return check;
		// 		}
		// 		
		// 		var sentence = text.split(".");
		// 		cache[text] = find(lang,sentence);
		
		return cache[text];
	};
	
	function tmpl(template) {
		template = template || '';
		var vals = (arguments.length === 2 && typeof arguments[1] === 'object' ? 
			arguments[1] : Array.prototype.slice.call(arguments, 1));
		
		var regx = /#\{([^{}]*)}/g;
		return template.replace(regx, function(str, match) {
			return typeof vals[match] === 'string' || typeof vals[match] === 'number' ? 
				vals[match] : str;
		});
	}

	var getTextFunc = function(text , nuller) {
		var searchFirst = tmpl('#{0}.#{1}',loc, text); 
		var searchSecond = tmpl('#{0}.#{1}',defaultLanguage, text); 
		
		return getText(searchFirst) || getText(searchSecond) || (!nuller ? searchSecond : undefined) ;
	};
	
	// Export for different environments
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = {
			getText: getTextFunc,
			lang: lang
		};
	}
	
	// Set as global property for Utils if available
	if (typeof global.Utils !== 'undefined') {
		global.Utils.getText = getTextFunc;
		global.Utils.lang = lang;
	}



})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this), typeof window !== 'undefined' ? window : {}, "pt-BR");