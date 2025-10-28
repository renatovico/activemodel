(function(ActiveModel,undefined) {

	var getText = function() {
	  	var sum = (function(pusher, args, start) {
			for(var i=start; i< args.length; i++){
		      pusher.push(args[i])
			}
			return pusher;
		})([], arguments, (arguments[0] === true ? 1 : 0));
	   	
		
	
		
		return Utils.getText(
			Utils.mustache("activerecord.{{model}}{{#extras}}.{{.}}{{/extras}}", 
				{"model": this.documentType , "extras": sum}
			),
			(arguments[0] === true ? 1 : 0)
		);
	};
	ActiveModel.addProperty("getText", getText);
	ActiveModel.addInstanceProperty("getText", getText);


})(ActiveModel);