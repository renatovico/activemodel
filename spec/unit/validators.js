describe 'RaisDocument'


		describe 'validação'

			it "beforeValidate"
				var user = ActiveModel("user", 
					["name"]
				);
				
				user.addProperty("beforeValidate", function() {
					this.addError("name" , "before Validate")
					return false;
				});
				
				var p = user.instance()
				p.valid().should.eql false
				p.errors.should.eql  { name: [ "before Validate" ] }
			end
			
			it "afterValidate"
				var user = ActiveModel("user", 
					["name"]
				);
				
				user.addProperty("afterValidate",function() {
					this.addError("name" , "after Validate")
					return false;
				});
				var p = user.instance()
				p.valid().should.eql false
				p.errors.should.eql  { name: [ "after Validate" ] }
			
			end
		
			it "acceptance"
				var user = ActiveModel("user", {"name" : "name" , "type" : "boolean"  })
				user.validateAcceptance("name",{ "qualifier" : true }) //Acceptance
				var p = user.instance()
				p.valid().should.eql false
				p.set("name" , true)
				p.valid().should.eql true

				var user = ActiveModel("user", {"name" : "name" , "type" : "boolean"  })
				user.validateAcceptance({"name" : "create"},{ "qualifier" : true }) //Acceptance
				var p = user.instance("create")
				p.valid().should.eql true
				p.valid("create").should.eql false
				p.valid("read").should.eql true


				var user = ActiveModel("user", {"name" : "name" , "type" : "boolean"  })
				user.validateAcceptance({"name" : ["update", "create"]},{ "qualifier" : true }) //Acceptance
				var p = user.instance("create")
				p.valid().should.eql true
				p.valid("create").should.eql false
				p.valid("read").should.eql true
				
			
			end
			
			it "confirmation"
				var user = ActiveModel("user", {"name" : "name" , "type" : "string"  })
				user.validateConfirmation("name",{}) //
				var p = user.instance()
				p.set("name", "1234")
				p.valid().should.eql false
				var p = user.instance()
				p.set("name", "1234")
				p.set("nameConfirmation", "1234")
				p.valid().should.eql true
			
			end
			
			it "each"
				var user = ActiveModel("user", 
					{"name" : "name" , "type" : "string"
				 })
				
				user.validateEach("name", { func : 
					function(field) {
						this.addError(field, 'error');
						return false;
					} 
				}); //Each
				var p = user.instance()
				p.valid().should.eql false
				var p = user.instance()
				p.set("name", "1234")
				p.valid().should.eql false
				p.errors.should.eql { name: [ "error" ] }
				
			end
			
			it "exclusion"
				var user = ActiveModel("user", {"name" : "name" , "type" : "string" })
				user.validateExclusion("name", { "qualifier": {"entrada" : true, "site" : true} } )
				var p = user.instance()
				p.set("name" , "entrada")
				p.valid().should.eql false
				p.set("name" , "site")
				p.valid().should.eql false
				var p = user.instance()
				p.set("name" , "renato")
				p.valid().should.eql true
			end
			
			it "format"
				var user = ActiveModel("user", {"name" : "name" , "type" : "string"   })
				user.validateFormat("name", {"qualifier" : /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i })
				var p = user.instance()
				p.set("name" , "orkut")
				p.valid().should.eql false
				var p = user.instance()
				p.set("name" , "renato@entradaonline.com.br")
				p.valid().should.eql true
			end
			
			it "inclusion"
				var user = ActiveModel("user", {"name" : "name" , "type" : "string"  })
				user.validateInclusion("name", {qualifier: {"entrada" : true, "site" : true}})
				var p = user.instance()
				p.set("name" , "orkut")
				p.valid().should.eql false
				var p = user.instance()
				p.set("name" , "entrada")
				p.valid().should.eql true
				p.set("name" , "site")
				p.valid().should.eql true
			end
			
			it "length"
				var user = ActiveModel("user", {"name" : "name" , "type" : "string" })
				user.validateLength("name", { is : 5})
				var p = user.instance()
				p.set("name" , "123")
				p.valid().should.eql false
				var p = user.instance()
				p.set("name" , "12345")
				p.valid().should.eql true
			end
			
			it "numericality"
				var user = ActiveModel("user", {"name" : "name" , "type" : "string" })
				user.validateNumericality("name" , { equal_to : 5})
				var p = user.instance()
				p.set("name" , "123")
				p.valid().should.eql false
				var p = user.instance()
				p.set("name" , 5)
				p.valid().should.eql true
			end
			
			
			it 'presence'
				var user = ActiveModel("user", {"name" : "name" , "type" : "string" })
				user.validatePresence("name")
				var p = user.instance()
				p.valid().should.eql false
				var p = user.instance()
				p.set("name", "1234")
				p.valid().should.eql true


				var user = ActiveModel("user", [{"name" : "name" , "type" : "string" } , {"name" : "handle" , "type" : "string" }])
				user.validatePresence(["name" , "handle"])
				var p = user.instance()
				p.valid().should.eql false
				var p = user.instance()
				p.set("name", "1234")
				p.set("handle", "1234")
				p.valid().should.eql true


			end
	
			
		
	
		
			
		end
		
		

		
	
end