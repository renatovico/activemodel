(function(jQuery,window, defaultLanguage, undefined) {

	jQuery.lang = {};

	/* Ensure language code is in the format aa-AA. */
	var normaliseLang = function(lang) {
		lang = lang.replace(/_/, '-').toLowerCase();
		if (lang.length > 3) {
			lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
		}
		return lang;
	};


	var loc = normaliseLang(navigator.language /* Mozilla */
					|| navigator.userLanguage /* IE */);
	
	
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

	function cacherize(arr, parent) {
	   jQuery.each(arr, function(k,v) {
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
			cacherize(jQuery.lang);
		}
		
		// var check = cache[text];
		// 		if (check) {
		// 			return check;
		// 		}
		// 		
		// 		var sentence = text.split(".");
		// 		cache[text] = find(jQuery.lang,sentence);
		
		return cache[text];
	};

	jQuery.getText = function(text , nuller) {
		var searchFirst = $.tmpl('#{0}.#{1}',loc, text); 
		var searchSecond = $.tmpl('#{0}.#{1}',defaultLanguage, text); 
		
		return getText(searchFirst) || getText(searchSecond) || (!nuller ? searchSecond : undefined) ;
	};



})(jQuery,window , "pt-BR");