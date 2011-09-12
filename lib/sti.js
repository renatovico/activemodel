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
