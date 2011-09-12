describe 'RaisDocument'

	describe 'associations'
	
		it 'belongsTo'
			var user = ActiveModel("user" , "name" )
			var address = ActiveModel("address", [
				{"name" : 'street', "type" : 'string' }, {"name" : 'number', "type" : 'string' }
			])
			address.belongsTo(user)
			true.should.eql true
		end

		it 'hasOne'
			var user = ActiveModel("user" , "name" )
			var address = ActiveModel("address", [
				{"name" : 'street', "type" : 'string' }, {"name" : 'number', "type" : 'string' }
			])
			user.hasOne(address)
			true.should.eql true
		end

		it 'hasMany'
			var user = ActiveModel("user" ,  "name" )
			var rule = ActiveModel("rule" ,  "name" )
			user.hasMany(rule)
			true.should.eql true
		end

	
		it 'novo apartir do hasOne'
			var user = ActiveModel("user" , "name" )
			var address = ActiveModel("address", [
				{"name" : 'street', "type" : 'string' }, {"name" : 'number', "type" : 'string' }
			])
			address.belongsTo(user)
			user.hasOne(address)
			

			var p = user.instance();
			p.set("name" , "ze")
			p.set("id" , 12)
			p.set("address" , {"street" : "1234", "number" : 'a'})
			p.get("address").get("user_id").should.eql 12
			p.get("address").documentType.should.eql "address"
			p.get("address").get("street").should.eql "1234"
			p.get("address").get("user").get("name").should.eql p.get("name")
			p.get("address").get("user").get("address").get("street").should.eql "1234"
			JSON.stringify(p.values()).should.eql JSON.stringify({name: "ze", id: 12 , address_attributes : {street: "1234" , number: "a", user_id : 12}})
		end
		
		it 'novo apartir do belongs_to'
			var user = ActiveModel("user" , "name" )
			var address = ActiveModel("address", [
				{"name" : 'street', "type" : 'string' }, {"name" : 'number', "type" : 'string' }
			])
			address.belongsTo(user)
			user.hasOne(address)

			var p = address.instance();
			p.set("street" , "1234");
			p.set("user", {});
			p.get("user").set("name","1234");
			p.get("user").documentType.should.eql "user"
			p.get("user").get("name").should.eql "1234"
			p.get("user").get("address").get("street").should.eql p.get("street")
			
			JSON.stringify(p.values()).should.eql JSON.stringify({street: "1234" , user_attributes : {name : "1234"} })
		end
		
		it 'novo apartir do has_many'
			var user = ActiveModel("user" , "name" )
			var rule = ActiveModel("rule" , "name" )
			rule.belongsTo(user)
			user.hasMany(rule)


			var p = user.instance();
			p.set("name" , "ze")
			p.build_rule({"name" : "po1de ler"})
			(p.get("rules") instanceof Array).should.eql true
			p.get("rules")[0].get("name").should.eql "po1de ler"
			p.get("rules")[0].get("user").get("name").should.eql p.get("name")
			p.get("rules")[0].get("user").get("rules")[0].get("name").should.eql "po1de ler"
			p.build_rule({"name" : "pode ler"})
			p.get("rules")[1].get("name").should.eql "pode ler"
			p.get("rules")[1].get("user").get("name").should.eql p.get("name")
			p.get("rules")[1].get("user").get("rules")[1].get("name").should.eql "pode ler"

			JSON.stringify(p.values()).should.eql JSON.stringify({name: "ze" , rules_attributes : [{name : 'pode ler'},{name : 'po1de ler'}]})
			
		end
	
		
		
		// it "#associated belongs_to"
		// 		
		// 			
		// 			var address = ActiveModel("address", [
		// 				('street', 'string' ),
		// 				('number', 'string' )
		// 			])
		// 			address.belongsTo("user" , { associated : true } )
		// 		
		// 			var user = ActiveModel("user" , 
		// 				('name', 'string' )
		// 			)
		// 			
		// 			user.hasOne("address")
		// 			
		// 			var p = ActiveModel.instance("address");
		// 			p.valid().should.eql true
		// 			p.set("user" , {})
		// 			p.valid().should.eql true
		// 			
		// 			ActiveModel.clear()
		// 			
		// 			var address = ActiveModel("address", [
		// 				('street', 'string' ),
		// 				('number', 'string' )
		// 			])
		// 			address.belongsTo("user" , { associated : true , presence: true } )
		// 		
		// 			var user = ActiveModel("user" , 
		// 				('name', 'string' , {presence: true } )
		// 			)
		// 			
		// 			user.hasOne("address")
		// 			
		// 			var p = ActiveModel.instance("address");
		// 			p.valid().should.eql false
		// 			p.set("user" , { id : "xxx"})
		// 			p.valid().should.eql false
		// 			p.get("user").set("name","1234")
		// 			p.valid().should.eql true
		// 		
		// 			
		// 			
		// 			
		// 		end
		// 		
		// 		it "#associated has_one"
		// 		
		// 		
		// 			var address = ActiveModel("address", [
		// 				('street', 'string' ),
		// 				('number', 'string' )
		// 			])
		// 			address.belongsTo("user"  )
		// 		
		// 			var user = ActiveModel("user" , 
		// 				('name', 'string' )
		// 			)
		// 			
		// 			user.hasOne("address" ,  { associated : true })
		// 			
		// 			var p = ActiveModel.instance("user");
		// 			p.valid().should.eql true
		// 			p.set("address" , {})
		// 			p.valid().should.eql true
		// 			
		// 			ActiveModel.clear()
		// 			
		// 			var address = ActiveModel("address", [
		// 				('street', 'string' , {presence : true}),
		// 				('number', 'string' )
		// 			])
		// 			address.belongsTo("user" )
		// 		
		// 			var user = ActiveModel("user" , 
		// 				('name', 'string'  )
		// 			)
		// 			
		// 			user.hasOne("address" ,  { associated : true , presence : true })
		// 			
		// 			var p = ActiveModel.instance("user");
		// 			p.valid().should.eql false
		// 			p.set("address" , {})
		// 			p.valid().should.eql false
		// 			p.get("address").set("street" , "1234")
		// 			p.valid().should.eql true
		// 		
		// 		
		// 		end
		
	end
	
	
	
end