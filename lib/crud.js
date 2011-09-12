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
