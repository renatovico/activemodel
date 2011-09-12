/** RailsDocument v0.2 - Built with build.js */
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
/*
Copyright (c) 2007 Ryan Schuft (ryan.schuft@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
  This code is based in part on the work done in Ruby to support
  infection as part of Ruby on Rails in the ActiveSupport's Inflector
  and Inflections classes.  It was initally ported to Javascript by
  Ryan Schuft (ryan.schuft@gmail.com).

  The code is available at http://code.google.com/p/inflection-js/

  The basic usage is:
    1. Include this script on your web page.
    2. Call functions on any String object in Javascript

  Currently implemented functions:

    String.pluralize(plural) == String
      renders a singular English language noun into its plural form
      normal results can be overridden by passing in an alternative

    String.singularize(singular) == String
      renders a plural English language noun into its singular form
      normal results can be overridden by passing in an alterative

    String.camelize(lowFirstLetter) == String
      renders a lower case underscored word into camel case
      the first letter of the result will be upper case unless you pass true
      also translates "/" into "::" (underscore does the opposite)

    String.underscore() == String
      renders a camel cased word into words seperated by underscores
      also translates "::" back into "/" (camelize does the opposite)

    String.humanize(lowFirstLetter) == String
      renders a lower case and underscored word into human readable form
      defaults to making the first letter capitalized unless you pass true

    String.capitalize() == String
      renders all characters to lower case and then makes the first upper

    String.dasherize() == String
      renders all underbars and spaces as dashes

    String.titleize() == String
      renders words into title casing (as for book titles)

    String.demodulize() == String
      renders class names that are prepended by modules into just the class

    String.tableize() == String
      renders camel cased singular words into their underscored plural form

    String.classify() == String
      renders an underscored plural word into its camel cased singular form

    String.foreign_key(dropIdUbar) == String
      renders a class name (camel cased singular noun) into a foreign key
      defaults to seperating the class from the id with an underbar unless
      you pass true
      
    String.ordinalize() == String
      renders all numbers found in the string into their sequence like "22nd"
*/

/*
  This function adds plurilization support to every String object
    Signature:
      String.pluralize(plural) == String
    Arguments:
      plural - String (optional) - overrides normal output with said String
    Returns:
      String - singular English language nouns are returned in plural form
    Examples:
      "person".pluralize() == "people"
      "octopus".pluralize() == "octopi"
      "Hat".pluralize() == "Hats"
      "person".pluralize("guys") == "guys"
*/
if(!String.prototype.pluralize)String.prototype.pluralize=function(plural)
{
  var str=this;
  if(plural)str=plural;
  else
  {
    var uncountable=false;
    for(var x=0;!uncountable&&x<this._uncountable_words.length;x++)
      uncountable=(this._uncountable_words[x]==str.toLowerCase());
    if(!uncountable) 
    {
      var matched=false;
      for(var x=0;!matched&&x<this._plural_rules.length;x++)
      {
        matched=str.match(this._plural_rules[x][0]);
        if(matched)
          str=str.replace(this._plural_rules[x][0],this._plural_rules[x][1]);
      }
    }
  }
  return str;
};

/*
  This function adds singularization support to every String object
    Signature:
      String.singularize(singular) == String
    Arguments:
      singular - String (optional) - overrides normal output with said String
    Returns:
      String - plural English language nouns are returned in singular form
    Examples:
      "people".singularize() == "person"
      "octopi".singularize() == "octopus"
      "Hats".singularize() == "Hat"
      "guys".singularize("person") == "person"
*/
if(!String.prototype.singularize)
  String.prototype.singularize=function(singular)
  {
    var str=this;
    if(singular)str=singular;
    else
    {
      var uncountable=false;
      for(var x=0;!uncountable&&x<this._uncountable_words.length;x++)
        uncountable=(this._uncountable_words[x]==str.toLowerCase());
      if(!uncountable)
      {
        var matched=false;
        for(var x=0;!matched&&x<this._singular_rules.length;x++)
        {
          matched=str.match(this._singular_rules[x][0]);
          if(matched)
            str=str.replace(this._singular_rules[x][0],
              this._singular_rules[x][1]);
        }
      }
    }
    return str;
  };

/*
  This is a list of nouns that use the same form for both singular and plural.
  This list should remain entirely in lower case to correctly match Strings.
  You can override this list for all Strings or just one depending on if you
  set the new values on prototype or on a given String instance.
*/
if(!String.prototype._uncountable_words)String.prototype._uncountable_words=[
  'equipment','information','rice','money','species','series','fish','sheep',
  'moose','deer','news'
];

/*
  These rules translate from the singular form of a noun to its plural form.
  You can override this list for all Strings or just one depending on if you
  set the new values on prototype or on a given String instance.
*/
if(!String.prototype._plural_rules)String.prototype._plural_rules=[
  [new RegExp('(m)an$','gi'),'$1en'],
  [new RegExp('(pe)rson$','gi'),'$1ople'],
  [new RegExp('(child)$','gi'),'$1ren'],
  [new RegExp('^(ox)$','gi'),'$1en'],
  [new RegExp('(ax|test)is$','gi'),'$1es'],
  [new RegExp('(octop|vir)us$','gi'),'$1i'],
  [new RegExp('(alias|status)$','gi'),'$1es'],
  [new RegExp('(bu)s$','gi'),'$1ses'],
  [new RegExp('(buffal|tomat|potat)o$','gi'),'$1oes'],
  [new RegExp('([ti])um$','gi'),'$1a'],
  [new RegExp('sis$','gi'),'ses'],
  [new RegExp('(?:([^f])fe|([lr])f)$','gi'),'$1$2ves'],
  [new RegExp('(hive)$','gi'),'$1s'],
  [new RegExp('([^aeiouy]|qu)y$','gi'),'$1ies'],
  [new RegExp('(x|ch|ss|sh)$','gi'),'$1es'],
  [new RegExp('(matr|vert|ind)ix|ex$','gi'),'$1ices'],
  [new RegExp('([m|l])ouse$','gi'),'$1ice'],
  [new RegExp('(quiz)$','gi'),'$1zes'],
  [new RegExp('s$','gi'),'s'],
  [new RegExp('$','gi'),'s']
];

/*
  These rules translate from the plural form of a noun to its singular form.
  You can override this list for all Strings or just one depending on if you
  set the new values on prototype or on a given String instance.
*/
if(!String.prototype._singular_rules)String.prototype._singular_rules=[
  [new RegExp('(m)en$','gi'),'$1an'],
  [new RegExp('(pe)ople$','gi'),'$1rson'],
  [new RegExp('(child)ren$','gi'),'$1'],
  [new RegExp('([ti])a$','gi'), '$1um'],
  [new RegExp('((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$',
    'gi'),'$1$2sis'],
  [new RegExp('(hive)s$','gi'), '$1'],
  [new RegExp('(tive)s$','gi'), '$1'],
  [new RegExp('(curve)s$','gi'), '$1'],
  [new RegExp('([lr])ves$','gi'), '$1f'],
  [new RegExp('([^fo])ves$','gi'), '$1fe'],
  [new RegExp('([^aeiouy]|qu)ies$','gi'), '$1y'],
  [new RegExp('(s)eries$','gi'), '$1eries'],
  [new RegExp('(m)ovies$','gi'), '$1ovie'],
  [new RegExp('(x|ch|ss|sh)es$','gi'), '$1'],
  [new RegExp('([m|l])ice$','gi'), '$1ouse'],
  [new RegExp('(bus)es$','gi'), '$1'],
  [new RegExp('(o)es$','gi'), '$1'],
  [new RegExp('(shoe)s$','gi'), '$1'],
  [new RegExp('(cris|ax|test)es$','gi'), '$1is'],
  [new RegExp('(octop|vir)i$','gi'), '$1us'],
  [new RegExp('(alias|status)es$','gi'), '$1'],
  [new RegExp('^(ox)en','gi'), '$1'],
  [new RegExp('(vert|ind)ices$','gi'), '$1ex'],
  [new RegExp('(matr)ices$','gi'), '$1ix'],
  [new RegExp('(quiz)zes$','gi'), '$1'],
  [new RegExp('s$','gi'), '']
];

/*
  This function adds camelization support to every String object
    Signature:
      String.camelize(lowFirstLetter) == String
    Arguments:
      lowFirstLetter - boolean (optional) - default is to capitalize the first
        letter of the results... passing true will lowercase it
    Returns:
      String - lower case underscored words will be returned in camel case
        additionally '/' is translated to '::'
    Examples:
      "message_properties".camelize() == "MessageProperties"
      "message_properties".camelize(true) == "messageProperties"
*/
if(!String.prototype.camelize)
  String.prototype.camelize=function(lowFirstLetter)
  {
    var str=this.toLowerCase();
    var str_path=str.split('/');
    for(var i=0;i<str_path.length;i++)
    {
      var str_arr=str_path[i].split('_');
      var initX=((lowFirstLetter&&i+1==str_path.length)?(1):(0));
      for(var x=initX;x<str_arr.length;x++)
        str_arr[x]=str_arr[x].charAt(0).toUpperCase()+str_arr[x].substring(1);
      str_path[i]=str_arr.join('');
    }
    str=str_path.join('::');
    return str;
  };

/*
  This function adds underscore support to every String object
    Signature:
      String.underscore() == String
    Arguments:
      N/A
    Returns:
      String - camel cased words are returned as lower cased and underscored
        additionally '::' is translated to '/'
    Examples:
      "MessageProperties".camelize() == "message_properties"
      "messageProperties".underscore() == "message_properties"
*/
if(!String.prototype.underscore)
  String.prototype.underscore=function()
  {
    var str=this;
    var str_path=str.split('::');
    var upCase=new RegExp('([ABCDEFGHIJKLMNOPQRSTUVWXYZ])','g');
    var fb=new RegExp('^_');
    for(var i=0;i<str_path.length;i++)
      str_path[i]=str_path[i].replace(upCase,'_$1').replace(fb,'');
    str=str_path.join('/').toLowerCase();
    return str;
  };

/*
  This function adds humanize support to every String object
    Signature:
      String.humanize(lowFirstLetter) == String
    Arguments:
      lowFirstLetter - boolean (optional) - default is to capitalize the first
        letter of the results... passing true will lowercase it
    Returns:
      String - lower case underscored words will be returned in humanized form
    Examples:
      "message_properties".humanize() == "Message properties"
      "message_properties".humanize(true) == "message properties"
*/
if(!String.prototype.humanize)
  String.prototype.humanize=function(lowFirstLetter)
  {
    var str=this.toLowerCase();
    str=str.replace(new RegExp('_id','g'),'');
    str=str.replace(new RegExp('_','g'),' ');
    if(!lowFirstLetter)str=str.capitalize();
    return str;
  };

/*
  This function adds capitalization support to every String object
    Signature:
      String.capitalize() == String
    Arguments:
      N/A
    Returns:
      String - all characters will be lower case and the first will be upper
    Examples:
      "message_properties".capitalize() == "Message_properties"
      "message properties".capitalize() == "Message properties"
*/
if(!String.prototype.capitalize)
  String.prototype.capitalize=function()
  {
    var str=this.toLowerCase();
    str=str.substring(0,1).toUpperCase()+str.substring(1);
    return str;
  };

/*
  This function adds dasherization support to every String object
    Signature:
      String.dasherize() == String
    Arguments:
      N/A
    Returns:
      String - replaces all spaces or underbars with dashes
    Examples:
      "message_properties".capitalize() == "message-properties"
      "Message Properties".capitalize() == "Message-Properties"
*/
if(!String.prototype.dasherize)
  String.prototype.dasherize=function()
  {
    var str=this;
    str=str.replace(new RegExp('[\ _]','g'),'-');
    return str;
  };

if(!String.prototype.underscorize)
  String.prototype.underscorize=function()
  {
    var str=this;
    str=str.replace(new RegExp('[\ _]','g'),'_');
    return str;
  };

/*
  This function adds titleize support to every String object
    Signature:
      String.titleize() == String
    Arguments:
      N/A
    Returns:
      String - capitalizes words as you would for a book title
    Examples:
      "message_properties".titleize() == "Message Properties"
      "message properties to keep".titleize() == "Message Properties to Keep"
*/
if(!String.prototype.titleize)
  String.prototype.titleize=function()
  {
    var str=this.toLowerCase();
    var t=new RegExp('^'+this._non_titlecased_words.join('$|^')+'$','i');
    str=str.replace(new RegExp('_','g'),' ');
    var str_arr=str.split(' ');
    for(var x=0;x<str_arr.length;x++)
    {
      var d=str_arr[x].split('-');
      for(var i=0;i<d.length;i++)if(!d[i].match(t))d[i]=d[i].capitalize();
      str_arr[x]=d.join('-');
    }
    str=str_arr.join(' ');
    str=str.substring(0,1).toUpperCase()+str.substring(1);
    return str;
  };

/*
  This is a list of words that should not be capitalized for title case.
  You can override this list for all Strings or just one depending on if you
  set the new values on prototype or on a given String instance.
*/
if(!String.prototype._non_titlecased_words)
  String.prototype._non_titlecased_words=[
    'and','or','nor','a','an','the','so','but','to','of','at','by','from',
    'into','on','onto','off','out','in','over','with','for'
  ];

/*
  This function adds demodulize support to every String object
    Signature:
      String.demodulize() == String
    Arguments:
      N/A
    Returns:
      String - removes module names leaving only class names (Ruby style)
    Examples:
      "Message::Bus::Properties".demodulize() == "Properties"
*/
if(!String.prototype.demodulize)
  String.prototype.demodulize=function()
  {
    var str=this;
    var str_arr=str.split('::');
    str=str_arr[str_arr.length-1];
    return str;
  };

/*
  This function adds tableize support to every String object
    Signature:
      String.tableize() == String
    Arguments:
      N/A
    Returns:
      String - renders camel cased words into their underscored plural form
    Examples:
      "MessageBusProperty".tableize() == "message_bus_properties"
*/
if(!String.prototype.tableize)
  String.prototype.tableize=function()
  {
    var str=this;
    str=str.underscore().pluralize();
    return str;
  };

/*
  This function adds classification support to every String object
    Signature:
      String.classify() == String
    Arguments:
      N/A
    Returns:
      String - underscored plural nouns become the camel cased singular form
    Examples:
      "message_bus_properties".classify() == "MessageBusProperty"
*/
if(!String.prototype.classify)
  String.prototype.classify=function()
  {
    var str=this;
    str=str.camelize().singularize();
    return str;
  };

/*
  This function adds foreign key support to every String object
    Signature:
      String.foreign_key(dropIdUbar) == String
    Arguments:
      dropIdUbar - boolean (optional) - default is to seperate id with an
        underbar at the end of the class name, you can pass true to skip it
    Returns:
      String - camel cased singular class names become underscored with id
    Examples:
      "MessageBusProperty".foreign_key() == "message_bus_property_id"
      "MessageBusProperty".foreign_key(true) == "message_bus_propertyid"
*/
if(!String.prototype.foreign_key)
  String.prototype.foreign_key=function(dropIdUbar)
  {
    var str=this;
    str=str.demodulize().underscore()+((dropIdUbar)?(''):('_'))+'id';
    return str;
  };

/*
  This function adds ordinalize support to every String object
    Signature:
      String.ordinalize() == String
    Arguments:
      N/A
    Returns:
      String - renders all found numbers their sequence like "22nd"
    Examples:
      "the 1 pitch".ordinalize() == "the 1st pitch"
*/
if(!String.prototype.ordinalize)
  String.prototype.ordinalize=function()
  {
    var str=this;
    var str_arr=str.split(' ');
    for(var x=0;x<str_arr.length;x++)
    {
	var i=parseInt(str_arr[x]);
        if(""+i!="NaN")
        {
          var ltd=str_arr[x].substring(str_arr[x].length-2);
          var ld=str_arr[x].substring(str_arr[x].length-1);
          var suf="th";
          if(ltd!="11"&&ltd!="12"&&ltd!="13")
          {
            if(ld=="1")suf="st";
            else if(ld=="2")suf="nd";
            else if(ld=="3")suf="rd";
          }
          str_arr[x]+=suf;
        }
    }
    str=str_arr.join(' ');
    return str;
  };


/*
 * jQuery Simple Templates plugin 1.1.1
 *
 * http://andrew.hedges.name/tmpl/
 * http://docs.jquery.com/Plugins/Tmpl
 *
 * Copyright (c) 2008 Andrew Hedges, andrew@hedges.name
 *
 * Usage: $.tmpl('<div class="#{classname}">#{content}</div>', { 'classname' : 'my-class', 'content' : 'My content.' });
 *        $.tmpl('<div class="#{1}">#{0}</div>', 'My content', 'my-class');   // placeholder order not important
 *
 * The changes for version 1.1 were inspired by the discussion at this thread:
 *   http://groups.google.com/group/jquery-ui/browse_thread/thread/45d0f5873dad0178/0f3c684499d89ff4
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($) {
	// regular expression for matching our placeholders; e.g., #{my-cLaSs_name77}
	var regx = /#\{([^{}]*)}/g;

	$.extend({
		// public interface: $.tmpl
		tmpl : function(tmpl) {
			// default to doing no harm
			tmpl = tmpl || '';
			var vals = (2 === arguments.length && 'object' === typeof arguments[1] ? arguments[1] : Array.prototype.slice.call(arguments,1));
			// function to making replacements
			var repr = function (str, match) {
				return typeof vals[match] === 'string' || typeof vals[match] === 'number' ? vals[match] : str;
			};
    		
			return tmpl.replace(regx, repr);
		}
	});
})(jQuery);

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
var ActiveModel = function(undefined) {
	
	var model = {};
	var modelInstance = {};
	

	
	
	var activemodel = function(name, fieldsProject) {
		
		var fields = [];
		var fieldsIndex = {};
	
	
		var obj = {
			"model" : {},
			"addProperty" : function(name, property) {
				return this.model[name] = property;
			},
			"documentType" : name,
			"addField" : function(field) {
				if (typeof field === 'string') {
					field = { "name" : field , "type" : "string"}
				}
				
				if (!field["name"] || !field["type"] || field["name"].trim() === '') {
					throw new Error("invalid field name :"+field["name"]);
				}
				
				if (fieldsIndex[field["name"]] != undefined) {
					fields[fieldsIndex[field["name"]]] = field;
				} else {
					fieldsIndex[field["name"]] = (fields.push(field) - 1);
				}
				
			},
			"addFields" : function(fields) {
				if (!(fields instanceof Array)) {
					fields = [fields];
				}
				
				for (var i = fields.length - 1; i >= 0; i--){
					this.addField(fields[i]);
				}
			},
			"reflect" : function() {
				return fields;
			},
			"instance" : function(submodel) {
				if (submodel && this.subModel && this.subModel(submodel)) {
					return this.subModel(submodel).instance();
				}
				
				var fieldsValues = {};
				
				var instanceObj = {
					"documentType" : name,
					"reflect" : function() {
						return obj.reflect();
					},
					"set" : function(field , value) {
						var fieldPosition = fieldsIndex[field];
						if (fieldPosition === undefined) {
							throw new Error("Invalid field: "+field);
						}
						
						var fieldSettings = fields[fieldPosition];
						
						if (fieldSettings["type"] == 'date' || fieldSettings["type"] == 'datetime' && !(value instanceof Date)) {
							value = Date.parserString(value, "yyyy-MM-ddTHH:mm:ss");
						}

						if (typeof fieldSettings.setter != 'function') {
							return fieldsValues[field] = value;
						} else {
							return fieldsValues[field] = fieldSettings.setter.call(this, value);
						}
	
					},
					"get" : function(field) {
						return fieldsValues[field];
					},
					"setAttributes" : function(attributes) {
						for(var k in attributes) {
							this.set(k, attributes[k]);
						}
						return this;
					},
					"values" : function(caller) {
						var resp = {};
						
						//TODO: MELHORAR !!!
						
						for(var k in fieldsValues) {
							//grr avoid nulls or undefined
							if (fieldsValues[k] !== undefined || fieldsValues[k] !== null) {
								
								var details = fields[fieldsIndex[k]];
								
								if (fieldsValues[k] && fieldsValues[k].values && fieldsValues[k].documentType != caller && details.nested) {
									
									resp[k+"_attributes"] = fieldsValues[k].values(this.documentType);
									
								} else if(fieldsValues[k] instanceof Array  && details.nested) {
									
									resp[k+"_attributes"] = [];
									for (var i = fieldsValues[k].length - 1; i >= 0; i--){
										if (fieldsValues[k][i].values && fieldsValues[k][i].documentType != caller) {
											resp[k+"_attributes"].push(fieldsValues[k][i].values(this.documentType));
										} else if(!fieldsValues[k][i].documentType) {
											resp[k+"_attributes"].push(fieldsValues[k][i]);
										}
									};
									
								} else {
									if (fieldsValues[k] && fieldsValues[k].documentType) {
										//ignore
									} else {
										resp[k] = fieldsValues[k];
									}
								}


							}
						}
												
						return resp;
					}
				};
				
				
				jQuery.extend(true,instanceObj, this.model);
				jQuery.extend(true,instanceObj, modelInstance);
				
				for (var i = fields.length - 1; i >= 0; i--){
					if (fields[i] && fields[i]["default"]) {
						instanceObj.set(fields[i]["name"],fields[i]["default"]);
					}
				};
				
				return instanceObj;
			}
		}
		
		
		if (typeof fieldsProject === 'string') {
			fieldsProject = [fieldsProject];
		}
	
		//pre-process fields
		if (fieldsProject) {
			try {
				obj.addFields(fieldsProject);
			} catch (e) {
				throw e;
			}
	
		}
	
	
		obj.addField({"name" : "id" , "type" : "number"});
		obj.addField({"name" : "_destroy" , "type" : "boolean"});
		jQuery.extend(true,obj, model);
	
		
		return obj;
	
	}
	
	activemodel.addProperty = function(name, property) {
		return model[name] = property;
	}
	
	activemodel.addInstanceProperty = function(name, property) {
		return modelInstance[name] = property;
	}
	
	
	return activemodel;
	
}();

try {
	module.exports = ActiveModel;
} catch(e){
}

(function(ActiveModel,undefined) {

	ActiveModel.addProperty("addSubModel", function(subModel) {
		if (!this.subModelsList) {
			this.subModelsList = {};
		}
		
		this.subModelsList[subModel.documentType] = subModel;
		
		return subModel;
	});


	ActiveModel.addProperty("subModel", function(name) {
		if (!this.subModelsList) {
			this.subModelsList = {};
		}

		return this.subModelsList[name];
	});

	ActiveModel.addProperty("sti",function(newName, fields) {
		if (!(fields instanceof Array)) {
			fields = [fields];
		};

		if (fields instanceof Array) {
			fields = jQuery.merge(fields, this.reflect());
		}

		var obj = ActiveModel(newName, fields);
		
		obj.addField({"name" : "type", "type" : "string" , "default" : newName });
		//todo colocar em função a passagem do objeto
		var self = this;
		
		obj.stiParent = obj.addProperty("stiParent", function() {
			return self.documentType;
		});
		
		this.addSubModel(obj);
		
		return obj;
	});


	
})(ActiveModel);

(function(ActiveModel,undefined) {

	
	ActiveModel.addProperty("belongsTo",function(model , properties , properties_fk) {
	
	
		this.addField(jQuery.extend({
			"name" : model.documentType.foreign_key(), "type": "number" , "foreignKey" : "true"
		}, properties_fk));

		this.addField(jQuery.extend({
			"name" : model.documentType, "type": model , "belongsTo" : "true",
			"setter" : function(value) {
				if (!(value.documentType)) {
					var newValue = model.instance().setAttributes(value);
					newValue.set(this.documentType, this);
					value = newValue;
				}

				if (value.get("id")) {
					this.set(model.documentType.foreign_key(), value.get("id"));
				}
				
				return value;
			}
		}, properties));
		
		this.addProperty("build_"+model.documentType, function(value) {
			var newValue = model.instance();
			newValue.setAttributes(value);

			this.set(model.documentType , newValue);

			return newValue;
		});

		return this;
	});

	ActiveModel.addProperty("hasOne",function(model , properties) {
		this.addField(jQuery.extend({
			"name" : model.documentType, "type": model , "hasOne" : "true",
			"setter" : function(value) {
				if (!(value.documentType)) {
					var newValue = model.instance().setAttributes(value);
					newValue.set(this.documentType, this);
					value = newValue;
				}
				
				return value;
			}
		}, properties));
		
		this.addProperty("build_"+model.documentType, function(value) {
			var newValue = model.instance();
			newValue.setAttributes(value);

			this.set(model.documentType , newValue);

			return newValue;
		});

		return this;
	});

	ActiveModel.addProperty("hasMany",function(model , properties) {
	
		this.addField(jQuery.extend({
			"name" : model.documentType.pluralize(), "type": model , "hasMany" : "true",
			"setter" : function(value) {

				if (!value instanceof Array)
				throw new Error('invalid association object');


				for (var i = value.length - 1; i >= 0; i--){
					if (!value[i].documentType) {
						var newValue = model.instance();
						newValue.setAttributes(value[i]);
						value[i] = newValue;
					}

					value[i].set(this.documentType, this);
				};
				

				var first = this.get(model.documentType.pluralize());
				if (!first){
					first = [];
				}

				return jQuery.merge(jQuery.merge( [], first) , value );

			}
		}, properties));

		
		this.addProperty("build_"+model.documentType, function(value) {
			var newValue = model.instance();
			newValue.setAttributes(value);

			this.set(model.documentType.pluralize() , [newValue]);

			return newValue;
		});
	
		return this;
	});

	
})(ActiveModel);

(function(ActiveModel,undefined) {

	// CORE

	var runValidator = function(on , parentInvocation, parentFlag, target) {
		var result = true;


		if (target.validators[on]) {
			for (var i = target.validators[on].length - 1; i >= 0; i--){
				
				testFunction = target.validators[on][i];
					
				if (!testFunction.func.call(target, testFunction.field, testFunction.opts, parentInvocation , parentFlag)) {
					result = false;
				}
					
			};
		}

		return result;

	}

	// Run validator in specific or all query, but, the submodels require the
	// execute the context too
	ActiveModel.addInstanceProperty("valid",function(on , parent) {
		this.errors = {};

		var runBefore = true;
		if (jQuery.isFunction(this.beforeValidate)){
			runBefore = this.beforeValidate(on , parent);
		}
		
		if (!this.validators) {
			this.validators = {};
		}
		
		// it`s necessary because in simple run && run, js execute in parallel (side effect)
		var run = true;
		if (typeof on === 'string'){
			run = runValidator(on, on , parent , this);
		}

		var runAll = runValidator("_all_", on , parent , this);
	
		var runAfter = true;
		if (jQuery.isFunction(this.afterValidate)){
			runAfter = this.afterValidate(on , parent);
		}

		return runBefore && run && runAll && runAfter;
		
	});

	ActiveModel.addInstanceProperty("errors", {});

	ActiveModel.addInstanceProperty("addError", function(field, error) {

		if (typeof this.errors[field] === "undefined") {
			this.errors[field] = [];
		}

		this.errors[field].push(error);

	});
	
	ActiveModel.addValidate = function(name, func , funcInstall) {
		
		
		this.addProperty( ("validate_"+name).camelize(true) , function(fields, opts) {

			if (jQuery.isFunction(funcInstall)) {
				funcInstall.call(this, fields, opts);
			}

		
			if (!this.model.validators) {
				this.model.validators = {};
			}
			
			if (!(fields instanceof Array)) {
				fields = [fields];
			}

			for (var i = fields.length - 1; i >= 0; i--){
				//convert to object
				if (typeof fields[i] === 'string') {
					var newfields = {};
					newfields[fields[i]] = null;
					fields[i] = newfields;
				}
			};
			
			
			for (var i = fields.length - 1; i >= 0; i--){
				for(var k in fields[i]) {
					var on = "_all_";
					if (fields[i][k]) {
						on = fields[i][k];
					}
					
					if (!(on instanceof Array)) {
						on = [on];
					}
					
					
					for (var z = on.length - 1; z >= 0; z--){
					
						if (!this.model.validators[on[z]]) {
							this.model.validators[on[z]] = [];
						}

						this.model.validators[on[z]].push({"func" : func , "opts" : opts , "field" : k })
						
					};
					
					
				}
			};
			
			
			
		});
		
	}
	
	
})(ActiveModel);

(function(ActiveModel,undefined) {


	// # :qualifier - Specifies value that is considered accepted.
	// # :message - Specifies a
	// custom error message (default is: "must be accepted").
	// # :on - Specifies when this validation is active (default is :save, other
	// options :create, :update).
	ActiveModel.addValidate("acceptance" ,  function(field, opts) {
			var value = this.get(field);
			var result = false;
	
			var message =  jQuery.getText("activerecord.errors.messages.accepted");
			if (opts.message)
				message = opts.message;
	
			if (value === opts.qualifier)
				result = true;
	
			if (!result)
				this.addError(field, message);
	
			return result;
	
	}, function(field, opts) {
		if (!opts.qualifier)
			throw new Error('invalid qualifier !');
	
		
	});
	
	
	// # :message - Specifies a custom error message (default is: "doesn‘t match
	// confirmation").
	// # :on - Specifies when this validation is active (default is :save, other
	// options :create, :update).
	
	ActiveModel.addValidate("confirmation", function(field, opts) {
		var result = true;
		var message = jQuery.getText("activerecord.errors.messages.confirmation");
		if (opts.message)
		message = opts.message;
	
		if (this.get(field) != this.get(field + "Confirmation")) {
			result = false;
			this.addError(field, message);
			this.addError(field + "Confirmation", message);
	
		}
		return result;
	
	}, function(fields, opts){
		// add fields Confirmation
	
		if (typeof fields === 'string')
			fields = [ fields ];
		for ( var i = 0; i < fields.length; i++) {
			this.addField({
				"name" : fields[i] + "Confirmation",
				"type" : "string"
			});
		}
	});
	
	
	
	// # :on - Specifies when this validation is active (default is :save, other
	// options :create, :update).
	ActiveModel.addValidate("each", function(fields, opts) {
		return opts.func.call(this, fields , opts);
	}, function(fields, opts) {
	
		if (typeof opts != 'object' || typeof opts.func != 'function') {
			throw new Error('invalid function is not present !');
		}
		
	});
	
	
	// # :message - A custom error message (default is: "can‘t be blank").
	// # :on - Specifies when this validation is active (default is :save, other
	// options :create, :update).
	
	ActiveModel.addValidate("presence", function(field, opts, parentInvocation) {
	
			var value = this.get(field);
			var result = true;
			
			var message = jQuery.getText("activerecord.errors.messages.blank");
			if (opts && opts.message){
				message = opts.message;
			}
	
			switch (typeof value) {
			case 'object':
				if (!value) {
					result = false;
					this.addError(field, message);
				}
				break;
			case 'string':
				if (jQuery.trim(value) === '') {
					result = false;
					this.addError(field, message);
				}
				break;
			case 'undefined':
				result = false;
				this.addError(field, message);
				break;
			}
	
			return result;
	
	});
	
	
	
	// # :on - Specifies when this validation is active (default is :save, other
	// options :create, :update).
	
	ActiveModel.addValidate("associated", function(field, opts, parentInvocation , parentFlag) {
			if (parentFlag)
				return true;
			
			var value = this.get(field);
			var result = true;
			
			switch (typeof value) {
			case 'object':
				if (value && value.valid) {
					result = value.valid(parentInvocation , true);
					// if (!result) {
					// 	this.addError(field, value.errors);
					// }
				}
				break;
			}
	
			return result;
	});
	
	
	// # :minimum - The minimum size of the attribute.
	// # :maximum - The maximum size of the attribute.
	// # :is - The exact size of the attribute.
	
	// # :too_long - The error message if the attribute goes over the maximum
	// (default is: "is too long (maximum is {{count}} characters)").
	// # :too_short - The error message if the attribute goes under the minimum
	// (default is: "is too short (min is {{count}} characters)").
	// # :wrong_length - The error message if using the :is method and the attribute
	// is the wrong size (default is: "is the wrong length (should be {{count}}
	// characters)").
	
	// # :on - Specifies when this validation is active (default is :save, other
	// options :create, :update).
	
	ActiveModel.addValidate("length", function(field, opts) {
			var value = this.get(field);
			var result = true;
	
			var too_long = jQuery.tmpl(jQuery.getText("activerecord.errors.messages.too_long"),{count: opts.maximum});
			if (opts.too_long)
				too_long = opts.too_long;
	
			var too_short = jQuery.tmpl(jQuery.getText("activerecord.errors.messages.too_short"),{count: opts.minimum});
			if (opts.too_short)
				too_short = opts.too_short;
	
			var wrong_length = jQuery.tmpl(jQuery.getText("activerecord.errors.messages.wrong_length"),{count: opts.is});
			if (opts.wrong_length)
				wrong_length = opts.wrong_length;
	
			var sizeToCheck;
			switch (typeof value) {
			case 'string':
				sizeToCheck = value.length;
				break;
			case 'number':
				sizeToCheck = String(value).length;
				break;
			case 'object':
				sizeToCheck = value.length;
				if (typeof sizeToCheck === 'undefined') {
					sizeToCheck = 0;
					for ( var obj in value) {
						sizeToCheck++;
					}
				}
				break;
			default:
				sizeToCheck = false;
				break;
			}
	
			if (opts.is && sizeToCheck != opts.is) {
				result = false;
				this.addError(field, wrong_length);
			}
	
			if (opts.minimum && sizeToCheck < opts.minimum) {
				result = false;
				this.addError(field, too_short);
			}
	
			if (opts.maximum && sizeToCheck > opts.maximum) {
				result = false;
				this.addError(field, too_long);
			}
	
			if (typeof sizeToCheck != 'number') {
				result = false;
				this.addError(field, jQuery.getText("activerecord.errors.messages.invalid"));
			}
	
			return result;
	}, function(fields, opts) {
		if (typeof opts != 'object'
				|| !(typeof opts.minimum === 'number'
						|| typeof opts.maximum === 'number' || typeof opts.is === 'number')) {
			throw new Error('invalid qualifieres , minimum & max or is option !');
		}
		
	});
	
	
	// # :greater_than - Specifies the value must be greater than the supplied value.
	// # :equal_to - Specifies the value must be equal to the supplied value.
	// # :less_than - Specifies the value must be less than the supplied value.
	
	ActiveModel.addValidate("numericality", function(field, opts) {
	
			var value = this.get(field);
			var result = true;
	
			var greater_than = jQuery.tmpl(jQuery.getText("activerecord.errors.messages.greater_than"),{count: opts.greater_than});
			if (opts.greater_than)
				greater_than = opts.greater_than;
	
			var equal_to = jQuery.tmpl(jQuery.getText("activerecord.errors.messages.equal_to"),{count: opts.equal_to});
			if (opts.equal_to)
				equal_to = opts.equal_to;
	
			var less_than = jQuery.tmpl(jQuery.getText("activerecord.errors.messages.less_than"),{count: opts.less_than});
			if (opts.less_than)
				less_than = opts.less_than;
			
	
			var sizeToCheck;
			switch (typeof value) {
			case 'number':
				sizeToCheck = value;
				break;
			default:
				sizeToCheck = false;
				break;
			}
	
			if (opts.equal_to && sizeToCheck != opts.equal_to) {
				result = false;
				this.addError(field, equal_to);
			}
	
			if (opts.less_than && sizeToCheck < opts.less_than) {
				result = false;
				this.addError(field, less_than);
			}
	
			if (opts.greater_than && sizeToCheck > opts.greater_than) {
				result = false;
				this.addError(field, greater_than);
			}
	
			if (typeof sizeToCheck != 'number') {
				result = false;
				this.addError(field, jQuery.getText("activerecord.errors.messages.invalid"));
			}
	
			return result;
	}, function(fields, opts) {
		if (typeof opts != 'object'
				|| !(typeof opts.greater_than === 'number' || typeof opts.less_than === 'number' || typeof opts.equal_to === 'number')) {
			throw new Error('invalid qualifieres , greater_than & less_than or equal_to option !');
		}
		
	});
	
	
	
	// # :message - A custom error message (default is: "is invalid").
	// # :qualifier - The regular expression used to validate the format with (note:
	// must
	// be supplied!).
	// # :on - Specifies when this validation is active (default is :save, other
	// options :create, :update).
	
	ActiveModel.addValidate("format",function(field, opts) {
			var value = this.get(field);
			var result = true;
	
			var message =  jQuery.getText("activerecord.errors.messages.invalid");
			if (opts.message)
				message = opts.message;
	
			if (!opts.qualifier.test(value)) {
				result = false;
				this.addError(field, message);
			}
	
			return result;
	}, function(fields, opts) {
		if (!opts.qualifier)
			throw new Error('invalid qualifier !');
		
	});
	
	
	// # :qualifier - An HashMap object of available items. ex: { "term" : true }
	// # :message - Specifies a custom error message (default is: "is not included
	// in the list").
	// # :on - Specifies when this validation is active (default is :save, other
	// options :create, :update).
	
	ActiveModel.addValidate("inclusion", function(field, opts) {
			var value = this.get(field);
			var result = false;
	
			var message =  jQuery.getText("activerecord.errors.messages.inclusion");
			if (opts.message)
				message = opts.message;
	
			if (opts.qualifier[value])
				result = true;
	
			if (!result)
				this.addError(field, message);
	
			return result;
	}, function(fields, opts) {
		if (!opts.qualifier)
			throw new Error('invalid qualifier !');
		
	});
	
	
	
	// # :qualifier - An HashMap object of exclusion items. ex: { "term" : true }
	// # :message - Specifies a custom error message (default is: "is not permitted
	// in the list").
	// # :on - Specifies when this validation is active (default is :save, other
	// options :create, :update).
	
	ActiveModel.addValidate("exclusion", function(field, opts) {
			var value = this.get(field);
			var result = true;
	
			var message =  jQuery.getText("activerecord.errors.messages.exclusion");
			if (opts.message)
				message = opts.message;
	
			if (opts.qualifier[value]) {
				result = false;
				this.addError(field, message);
			}
	
			return result;
	}, function(fields, opts) {
		if (!opts.qualifier)
			throw new Error('invalid qualifier !');
		
	});

})(ActiveModel);
(function(ActiveModel,undefined) {

	var sortModel = function(a ,b) {
		if (!b.sort) {
			b.sort = 0;
		}
		if (!a.sort) {
			a.sort = 0;
		}
		return a.sort - b.sort;
	};
	
	var reflectSort = function(scope) {
		return this.reflect().sort(sortModel);
	};
	
	var reflectWithScope = function(scope) {
		var lookup = this.reflect();
		
		var resp = [];
		
		for (var i = lookup.length, x = 0; x < i; x++){
			var look = lookup[x];
			if(jQuery.inArray(scope, look.on) != '-1') {
				resp.push(look);
			}
		
		};
		
		resp.sort(sortModel);
		
		return resp;
	};

	var reflectFields = function(fields) {
		var lookup = this.reflect();
		
		var resp = [];
		
		for (var i = lookup.length, x = 0; x < i; x++){
			var look = lookup[x];
			look.sort = jQuery.inArray(look.name, fields);
			if(look.sort != '-1') {
				resp.push(look);
			}
		
		};
		
		resp.sort(sortModel);
		
		
		return resp;
	};
	
	
	ActiveModel.addProperty("reflectSort", reflectSort);
	ActiveModel.addInstanceProperty("reflectSort", reflectSort);
	ActiveModel.addProperty("reflectWithScope", reflectWithScope);
	ActiveModel.addInstanceProperty("reflectWithScope", reflectWithScope);
	ActiveModel.addProperty("reflectFields", reflectFields);
	ActiveModel.addInstanceProperty("reflectFields", reflectFields);

})(ActiveModel);
(function(ActiveModel,undefined) {

	var getText = function() {
	  	var sum = (function(pusher, args, start) {
			for(var i=start; i< args.length; i++){
		      pusher.push(args[i])
			}
			return pusher;
		})([], arguments, (arguments[0] === true ? 1 : 0));
	   	
		
	
		
		return jQuery.getText(
			jQuery.mustache("activerecord.{{model}}{{#extras}}.{{.}}{{/extras}}", 
				{"model": this.documentType , "extras": sum}
			),
			(arguments[0] === true ? 1 : 0)
		);
	};
	ActiveModel.addProperty("getText", getText);
	ActiveModel.addInstanceProperty("getText", getText);


})(ActiveModel);
(function(ActiveModel,undefined) {

	ActiveModel.addProperty("timeStamps", function() {
		this.addField({"name" : "created_at" , "type" : "datetime"});
		this.addField({"name" : "updated_at" , "type" : "datetime"});
	});

	var processSuccess = function(resp,type,respAjax , callOk, callFail) {
			try {
				var respParser = JSON.parse(resp);
				this.setAttributes(respParser[this.documentType]);
			} catch (err) {
				if (resp.length > 1) {
					// window.alert('erro ao processar resposta do servidor');
					// console.log(err);
					if (jQuery.isFunction(callFail)) {
						callFail.call(this, err, type, respAjax);
					}
					
					return false;
				}
			}

			if (jQuery.isFunction(callOk)) {
				callOk.call(this, resp, type, respAjax);
			}
		}

		var processError = function(resp, type, respAjax , callOk, callFail) {
			try {
					var data = JSON.parse(resp.responseText);
					jQuery.each(data, (function(row) {
							return function(field,error) {
								row.addError(field , error);
							}

						})(this)
					);

			} catch(err) {
				// console.log(err);
				// window.alert('erro ao processar resposta do servidor');
			}


			if (jQuery.isFunction(callFail)) {
				callFail.call(this, resp, type, respAjax);
			}
		}

	ActiveModel.addInstanceProperty("create",function(callOk, callFail) {
		if (!this.valid("create")) {
			if (jQuery.isFunction(callFail)) {
					callFail.call(this);
			}
			return false;
		}
		
		

		var self = this;
		var data = {};
		data[this.documentType] = this.values();
		data = JSON.stringify(data);
		
		jQuery.ajax({
			url : "/"+this.documentType.pluralize()+".json",
			type: "post",
			data : data,
			contentType : "application/json",
			dataType: 'text',
			success: function( resp , type , respAjax) {
				processSuccess.call(self, resp, type, respAjax, callOk, callFail);
			},
			error : function( resp , type , respAjax) {
				processError.call(self, resp, type, respAjax, callOk, callFail);
			},
			complete: function () {
				
			}
		
		});
				
		
	});

	ActiveModel.addProperty("read",function(id, callOk, callFail) {
		
		
		var self = this;
		jQuery.ajax({
			url : "/"+this.documentType.pluralize()+"/"+id+".json",
			type: "get",
			dataType: 'text',
			success: function( resp , type , respAjax) {
				var newObj = self.instance();
				try {
					var respParser = JSON.parse(resp);
					
					newObj.setAttributes(respParser[self.documentType]);
				} catch (err) {
					if (resp.length > 1) {
						// window.alert('erro ao processar resposta do servidor');

						if (jQuery.isFunction(callFail)) {
							callFail.call(self , err, type, respAjax);
						}

						return false;
					}
				}

				
				if (jQuery.isFunction(callOk)) {
					callOk.call(self , newObj , type , respAjax);
				}

			},
			error : function( resp , type , respAjax) {
				if (jQuery.isFunction(callFail)) {
					callFail.call(self, resp, type, respAjax);
				}
			},
			complete: function () {
			}
			
		});
		
	});
	
	ActiveModel.addInstanceProperty("update",function(callOk, callFail) {
		
		if (!this.valid("update")) {
			if (jQuery.isFunction(callFail)) {
					callFail.call(this);
			}
			return false;
		}

		


		var self = this;
		var data = {"_method" : "put"};
		data[this.documentType] = this.values();
		data = JSON.stringify(data);
		
		// console.log(data);
		
		jQuery.ajax({
			url :  "/"+this.documentType.pluralize()+"/"+this.get("id")+".json",
			type: "put",
			contentType : "application/json",
			data : data,
			dataType: 'text',
			success: function( resp , type , respAjax) {
				processSuccess.call(self, resp, type, respAjax, callOk, callFail);
			},
			error : function( resp , type , respAjax) {
				processError.call(self, resp, type, respAjax, callOk, callFail);
			},
			complete: function () {
				
			}
		
		});
		
	});
	
	
	ActiveModel.addInstanceProperty("destroy",function(callOk, callFail) {
		
		if (!this.valid("destroy")) {
			if (jQuery.isFunction(callFail)) {
					callFail.call(this);
			}
			return false;
		}

		

		var self = this;
		var data = {"_method" : "delete"};
		data = JSON.stringify(data);
		
		jQuery.ajax({
			url :  "/"+this.documentType.pluralize()+"/"+this.get("id")+".json",
			type: "delete",
			data : data,
			contentType : "application/json",
			dataType: 'text',
			success: function( resp , type , respAjax) {
				if (jQuery.isFunction(callOk)) {
					callOk.call(this, resp, type, respAjax);
				}
				
				delete self;
				self = null;
			},
			error : function( resp , type , respAjax) {
				if (jQuery.isFunction(callFail)) {
					callFail.call(self, resp, type, respAjax);
				}
			},
			complete: function () {
				
			}
		
		});
		
	});



	ActiveModel.addProperty("stubCollection",function(args,data) {
		if(!this.stubs) {
			this.stubs = {};
		}
		
		this.stubs[JSON.stringify(args)] = JSON.stringify(data);
	});
	
	
	ActiveModel.addProperty("collection",function(args,callOk,callFail) {
		var self = this;
		
		if(!this.stubs) {
			this.stubs = {};
		}
		
		
		var collectionSuccess = function(resp,type,respAjax) {
			var result = [];

			try {
				resp = JSON.parse(resp);
				
				jQuery.each(resp, function(o,k) {
					jQuery.each(k,function(k2, v) {
							var newData = self.instance(k2);
							
							newData.setAttributes(v);
							result.push(newData);
					});
				});
			} catch (err) {
				// console.log(err);
				if (jQuery.isFunction(callFail)) {
		 			callFail.call(self, err , type , respAjax);
		 		}
				return false;
			}
    
			if (jQuery.isFunction(callOk)) {
				callOk.call(self , result , type , respAjax);
			}
		};
		
		// console.log(args);
		var cache = this.stubs[JSON.stringify(args)]
		if (cache) {
			collectionSuccess(cache,"success",{});
		} else {
			jQuery.ajax({
				url : "/"+this.documentType.pluralize()+".json",
				type: "get",
				data : args,
				dataType: 'text',
				success: collectionSuccess,
				error : function( resp , type , respAjax) {
					// console.log(resp);
					if (jQuery.isFunction(callFail)) {
				 		callFail.call(self, resp, type, respAjax);
				 	}
				},
				complete: function () {

				}
			});
		}
		

		
		
	});

	
})(ActiveModel);

