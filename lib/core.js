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
