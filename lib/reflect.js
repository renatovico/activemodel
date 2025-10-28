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
			if(Utils.inArray(scope, look.on) != '-1') {
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
			look.sort = Utils.inArray(look.name, fields);
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