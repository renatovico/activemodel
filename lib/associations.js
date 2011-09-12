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
