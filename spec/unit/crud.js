describe 'RaisDocument'
	describe 'crud'
		before
			user = ActiveModel("user", "name")
			user.timeStamps()
			mocker = mockRest(user, mock_request);

			returnOk = function(resp) {
				true.should.eql true
			};
			returnFail = function(err) {
				true.should.eql false
			};
		end
	

		it 'create #ok'
			var jose = user.instance()
			jose.set("name" , "jose")

			mocker.create(jose);
			jose.create(function() {
				jose.get("id").should.eql 4
				jose.get("created_at").should.eql "2010-09-21T19:10:28Z"
				jose.get("updated_at").should.eql "2010-09-21T19:10:28Z"
			},returnFail)		
		end

		it 'create #fail because errors'
			var jose = user.instance()
			mocker.create(jose, mocker.error);
			jose.create(returnFail,function() {
				jose.errors["name"].should.eql [ 'can\'t be blank' ]
			})
		end

		it 'create #fail entity not processed'
			var jose = user.instance()
			jose.set("name" , "jose")
		
			mocker.create(jose , mocker.fail);
			jose.create(returnFail,returnOk)
		end

		
		it 'read'
			mocker.read();
			var z = user.read(1,function(data) {
				data.get("id").should.eql 4
				console.log(data.get("id"))
			}, returnFail)
		end

		it 'read #notfound'
			mocker.read(mocker.notfound);
			var z = user.read(1, returnFail, returnOk)
		end
		
		it 'read #fail'
			mocker.read(mocker.fail);
			var z = user.read(1, returnFail, returnOk)
		end
		
		
		it 'update'
			mocker.read();
			var z = user.read(1, function(data) {
				mocker.update();
				data.set("name", "1234");
				data.update(returnOk,returnFail)
			},returnFail);
		end
		
		it 'update #errors'
	   	 	mocker.read();
	   	 	var z = user.read(1, function(data) {
	   	 		mocker.update(mocker.error);
	   	 		data.set("name", "1234");
	   	 		data.update(returnFail,function() {
					data.errors["name"].should.eql [ 'can\'t be blank' ]
		
				})
	   	 	},returnFail);
		end
		
		it 'update #fail'
			mocker.read();
			var z = user.read(1, function(data) {
				mocker.update(mocker.fail);
				data.set("name", "1234");
				data.update(returnFail, returnOk)
			},returnFail);
		end
		
		it 'destroy'
			mocker.read();
			var z = user.read(1, function(data) {
				mocker.destroy();
				data.destroy(returnOk,returnFail)
			},returnFail);
		end
		
		it 'destroy #fail'
			mocker.read();
			var z = user.read(1, function(data) {
				mocker.destroy(mocker.fail);
				data.destroy(returnFail, returnOk)
			},returnFail);
		end
		
		
		it 'collection'
			mocker.collection();
			var users = user.collection({},function(data) {
				data.length.should.eql 2
			},returnFail)
		end
		
		it 'collection #fail'
			mocker.collection(mocker.fail);
			var users = user.collection({},returnFail, returnOk)
		end

		
	end
end