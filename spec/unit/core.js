describe 'RaisDocument'

	describe 'core'
		it 'without field definition'
			var user = ActiveModel("user")
			true.should.eql true
		end

		it 'one field'
			var user = ActiveModel("user", 
				["name"]
			);
			
			user.instance().documentType.should.eql "user"
			
			var userRoberto = user.instance()
			userRoberto.documentType.should.eql "user"
			
			userRoberto.set("name","Roberto")
			userRoberto.get("name").should.eql "Roberto"
			
		end
		
		
		it 'many fields'
			var fields = [
				 'name',
				 'street',
				 {"name" : 'number', "type" : 'number'},
				 'city',
				 'state',
				 {"name" : 'showMap', "type" : 'boolean'}
			];
			var user = ActiveModel("user", fields)
			user.documentType.should.eql "user"
		
			var userRoberto = user.instance()
			userRoberto.documentType.should.eql "user"
			userRoberto.set("name","Roberto")
			userRoberto.set("number",1234)
			userRoberto.setAttributes({"city" : "maria" , "state" : "sp"});
		
			var userJoao = user.instance("user")
			userJoao.set("name","Joao")
			userJoao.set("number",50)
			userJoao.setAttributes({"city" : "soro" , "state" : "tr"});
		
			userRoberto.get("name").should.eql "Roberto"
			userRoberto.get("number").should.eql 1234
			userRoberto.get("city").should.eql "maria"
			userRoberto.get("state").should.eql "sp"
		
			userJoao.get("name").should.eql "Joao"
			userJoao.get("number").should.eql 50
			userJoao.get("city").should.eql "soro"
			userJoao.get("state").should.eql "tr"
		
				try {
					userJoao.set("zinga",1)
					false.should.eql true
				} catch(err) {
					err.message.should.eql "Invalid field: zinga"
				}

		
		end
		
		it 'field name invalid'
			try {
				var result = ActiveModel("user", [
					' '
				])
				true.should.eql false
			} catch(err) {
				err.message.should.eql "invalid field name : "
			}
			
			
		end
		
			
		it 'get attributes'
		
			var user = ActiveModel("user", 'name')
			var p = user.instance()
			p.set("id", 1)
			JSON.stringify(p.values()).should.eql "{\"id\":1}"
		end
		
	end
	
end