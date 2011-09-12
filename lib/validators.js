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