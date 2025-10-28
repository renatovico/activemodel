/**
 * Utility functions to replace jQuery dependencies
 * Plain JavaScript implementations
 */

(function(global) {
	var Utils = {
		/**
		 * Deep extend/merge objects (replaces jQuery.extend)
		 * @param {boolean} deep - Whether to perform deep merge
		 * @param {object} target - Target object
		 * @param {...object} sources - Source objects
		 * @returns {object} Merged object
		 */
		extend: function(deep, target) {
			// Handle the case where deep is not provided
			if (typeof deep !== 'boolean') {
				var args = Array.prototype.slice.call(arguments);
				target = args[0];
				var sources = args.slice(1);
				deep = false;
			} else {
				var sources = Array.prototype.slice.call(arguments, 2);
			}
			
			if (!target) {
				target = {};
			}
			
			for (var i = 0; i < sources.length; i++) {
				var source = sources[i];
				if (!source) continue;
				
				for (var key in source) {
					if (source.hasOwnProperty(key)) {
						if (deep && source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
							target[key] = this.extend(true, target[key] || {}, source[key]);
						} else {
							target[key] = source[key];
						}
					}
				}
			}
			
			return target;
		},
		
		/**
		 * Check if value is a function (replaces jQuery.isFunction)
		 * @param {*} obj - Value to check
		 * @returns {boolean} True if function
		 */
		isFunction: function(obj) {
			return typeof obj === 'function';
		},
		
		/**
		 * Iterate over array or object (replaces jQuery.each)
		 * @param {Array|Object} obj - Object to iterate
		 * @param {Function} callback - Callback function
		 */
		each: function(obj, callback) {
			if (Array.isArray(obj)) {
				for (var i = 0; i < obj.length; i++) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			} else if (obj && typeof obj === 'object') {
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						if (callback.call(obj[key], key, obj[key]) === false) {
							break;
						}
					}
				}
			}
		},
		
		/**
		 * Merge arrays (replaces jQuery.merge)
		 * @param {Array} first - First array
		 * @param {Array} second - Second array
		 * @returns {Array} Merged array
		 */
		merge: function(first, second) {
			var result = first.slice();
			for (var i = 0; i < second.length; i++) {
				result.push(second[i]);
			}
			return result;
		},
		
		/**
		 * Find index of value in array (replaces jQuery.inArray)
		 * @param {*} value - Value to find
		 * @param {Array} array - Array to search
		 * @returns {number} Index or -1 if not found
		 */
		inArray: function(value, array) {
			if (array.indexOf) {
				return array.indexOf(value);
			}
			for (var i = 0; i < array.length; i++) {
				if (array[i] === value) {
					return i;
				}
			}
			return -1;
		},
		
		/**
		 * Simple template function (replaces jQuery.tmpl)
		 * @param {string} tmpl - Template string with #{placeholders}
		 * @param {object|...values} vals - Values to replace
		 * @returns {string} Processed template
		 */
		tmpl: function(tmpl) {
			tmpl = tmpl || '';
			var vals = (arguments.length === 2 && typeof arguments[1] === 'object' ? 
				arguments[1] : Array.prototype.slice.call(arguments, 1));
			
			var regx = /#\{([^{}]*)}/g;
			return tmpl.replace(regx, function(str, match) {
				return typeof vals[match] === 'string' || typeof vals[match] === 'number' ? 
					vals[match] : str;
			});
		},
		
		/**
		 * Mock getText function (replaces jQuery.getText)
		 * @param {string} key - Translation key
		 * @returns {string} Translation or key
		 */
		getText: function(key) {
			// Simple implementation - returns the key
			// Can be enhanced with actual translation logic
			return key || 'mock';
		},
		
		/**
		 * Simple mustache-style template (replaces jQuery.mustache)
		 * @param {string} template - Template string
		 * @param {object} data - Data object
		 * @returns {string} Processed template
		 */
		mustache: function(template, data) {
			return template.replace(/\{\{#?(\w+)\}\}(.*?)\{\{\/\1\}\}|\{\{(\w+)\}\}/g, 
				function(match, key1, content, key2) {
					var key = key1 || key2;
					var value = data[key];
					if (key1 && content) {
						// Handle sections like {{#key}}content{{/key}}
						return value ? content : '';
					}
					return value !== undefined ? value : '';
				}
			);
		},
		
		/**
		 * AJAX wrapper using XMLHttpRequest (replaces jQuery.ajax)
		 * @param {object} options - AJAX options
		 */
		ajax: function(options) {
			var xhr = new XMLHttpRequest();
			var method = (options.type || 'GET').toUpperCase();
			var url = options.url;
			var data = options.data;
			var async = options.async !== false;
			
			xhr.open(method, url, async);
			
			// Set headers
			if (options.contentType) {
				xhr.setRequestHeader('Content-Type', options.contentType);
			}
			if (options.dataType === 'json' && method === 'GET') {
				xhr.setRequestHeader('Accept', 'application/json');
			}
			
			// Handle response
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					var response = xhr.responseText;
					
					if (xhr.status >= 200 && xhr.status < 300) {
						if (options.success) {
							options.success(response, 'success', xhr);
						}
					} else {
						if (options.error) {
							options.error(xhr, 'error', xhr);
						}
					}
					
					if (options.complete) {
						options.complete(xhr, xhr.status >= 200 && xhr.status < 300 ? 'success' : 'error');
					}
				}
			};
			
			// Send request
			if (method === 'GET' && data) {
				// For GET requests, append data to URL
				var params = [];
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
					}
				}
				if (params.length > 0) {
					url += (url.indexOf('?') === -1 ? '?' : '&') + params.join('&');
				}
				xhr.open(method, url, async);
				xhr.send();
			} else {
				xhr.send(typeof data === 'string' ? data : null);
			}
		}
	};
	
	// Export for different environments
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Utils;
	} else {
		global.Utils = Utils;
	}
	
	// Always make Utils available globally for the build
	global.Utils = Utils;
	
	// Create jQuery-compatible global reference for backward compatibility during transition
	if (typeof global.jQuery === 'undefined') {
		global.jQuery = Utils;
	}
	
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
