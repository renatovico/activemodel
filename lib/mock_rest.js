

var mockRest = (function(undefined) {
	return function(model, mock_request) {
		var mocker = {};

		mocker.ok = 0;
		mocker.error = 1;
		mocker.notfound = 2;
		mocker.fail = 3;

		mocker.create = function(instance, type) {
			switch(type) {
				case mocker.error:
					mock_request().and_return(JSON.stringify({"name":"can't be blank"}), 'text', 422 );
				break;
				case mocker.fail:
					mock_request().and_return(JSON.stringify({}), 'text', 404 );
				break;
				default:
					mock_request().and_return(JSON.stringify({"user":{"created_at":"2010-09-21T19:10:28Z","id":4,"name":instance.get("name"),"updated_at":"2010-09-21T19:10:28Z"}}), 'text', 200 );
				break;
			}
		}

		mocker.update = function(type) {
			switch(type) {
				case mocker.error:
					mock_request().and_return(JSON.stringify({"name":"can't be blank"}), 'text', 422 );
				break;
				case mocker.fail:
					mock_request().and_return(JSON.stringify({}), 'text', 404 );
				break;
				default:
					mock_request().and_return(JSON.stringify({}), 'text', 200 );
				break;
			}
		}
		
		mocker.read = function(type) {
			switch(type) {
				case mocker.notfound:
				case mocker.fail:
					mock_request().and_return(JSON.stringify({}), 'text', 404 );
					mock_request().and_return(JSON.stringify({}), 'text', 404 );
				break;
				default:
					mock_request().and_return(JSON.stringify({"user":{"created_at":"2010-09-21T19:10:28Z","id":4,"name":"jose","updated_at":"2010-09-21T19:10:28Z"}}), 'text', 200 );
				break;
			}
		}
		
		mocker.destroy = function(type) {
			switch(type) {
				case mocker.notfound:
				case mocker.fail:
					mock_request().and_return(JSON.stringify({}), 'text', 404 );
					mock_request().and_return(JSON.stringify({}), 'text', 404 );
				break;
				default:
					mock_request().and_return(JSON.stringify({}), 'text', 200 );
				break;
			}
		}
		mocker.collection = function(type) {
			switch(type) {
				case mocker.notfound:
				case mocker.fail:
					mock_request().and_return(JSON.stringify({}), 'text', 404 );
					mock_request().and_return(JSON.stringify({}), 'text', 404 );
				break;
				default:
					mock_request().and_return(JSON.stringify(
						[{"user":{"created_at":"2010-09-21T19:07:20Z","id":3,"name":null,"updated_at":"2010-09-21T19:07:20Z"}},{"user":{"created_at":"2010-09-21T19:10:28Z","id":4,"name":"1","updated_at":"2010-09-21T19:10:28Z"}}]
						), 'text', 200 );
				break;
			}
		}
		
		return mocker;
		
	}
})();


if (module) {
	module.exports = mockRest;
}
