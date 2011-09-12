describe 'RaisDocument'

	describe 'sti'

			it "inhretid"
				var user = ActiveModel("user", "name")
				var admin = user.sti("admin" , {"name" : "level" , "type" : "number"})
	
				var joao = admin.instance()
				joao.set("name" , "Joao")
				joao.set("level" , 1234)
	
				joao.documentType.should.eql "admin"
				joao.get("type").should.eql "admin"
				joao.stiParent().should.eql "user"

				var andre = user.instance()
				andre.set("name", "andre")
				andre.documentType.should.eql "user"

				var attributes = "[{\"name\":\"id\",\"type\":\"number\"},{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"level\",\"type\":\"number\"},{\"name\":\"type\",\"type\":\"string\",\"default\":\"admin\"}]"
				JSON.stringify(admin.reflect()).should.eql attributes
				JSON.stringify(joao.values()).should.eql "{\"type\":\"admin\",\"name\":\"Joao\",\"level\":1234}"

				var attributes = "[{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"id\",\"type\":\"number\"}]"
				JSON.stringify(user.reflect()).should.eql attributes
				JSON.stringify(andre.values()).should.eql "{\"name\":\"andre\"}"


			end
			
			
	end
end