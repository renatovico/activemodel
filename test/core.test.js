/**
 * Core functionality tests for ActiveModel
 * Converted from JSpec to Mocha/Chai
 */

require('./setup');
const { expect } = require('chai');

describe('ActiveModel Core', function() {
    
    describe('Model Definition', function() {
        
        it('should create model without field definition', function() {
            const user = ActiveModel('user');
            expect(user).to.exist;
        });
        
        it('should create model with one field', function() {
            const user = ActiveModel('user', ['name']);
            
            expect(user.instance().documentType).to.equal('user');
            
            const userRoberto = user.instance();
            expect(userRoberto.documentType).to.equal('user');
            
            userRoberto.set('name', 'Roberto');
            expect(userRoberto.get('name')).to.equal('Roberto');
        });
        
        it('should create model with many fields', function() {
            const fields = [
                'name',
                'street',
                { name: 'number', type: 'number' },
                'city',
                'state',
                { name: 'zip_code', type: 'string' }
            ];
            
            const address = ActiveModel('address', fields);
            const addressInstance = address.instance();
            
            addressInstance.set('name', 'John Doe');
            addressInstance.set('street', 'Main St');
            addressInstance.set('number', 123);
            addressInstance.set('city', 'Springfield');
            
            expect(addressInstance.get('name')).to.equal('John Doe');
            expect(addressInstance.get('street')).to.equal('Main St');
            expect(addressInstance.get('number')).to.equal(123);
            expect(addressInstance.get('city')).to.equal('Springfield');
        });
        
        it('should handle field types correctly', function() {
            const user = ActiveModel('user', [
                { name: 'age', type: 'number' },
                { name: 'active', type: 'boolean' },
                { name: 'name', type: 'string' }
            ]);
            
            const instance = user.instance();
            
            instance.set('age', 30);
            instance.set('active', true);
            instance.set('name', 'Test User');
            
            expect(instance.get('age')).to.equal(30);
            expect(instance.get('active')).to.equal(true);
            expect(instance.get('name')).to.equal('Test User');
        });
        
        it('should serialize values correctly', function() {
            const user = ActiveModel('user', ['name', 'email']);
            const instance = user.instance();
            
            instance.set('name', 'John');
            instance.set('email', 'john@example.com');
            
            const values = instance.values();
            
            expect(values).to.have.property('name', 'John');
            expect(values).to.have.property('email', 'john@example.com');
        });
        
        it('should handle default values', function() {
            const user = ActiveModel('user', [
                { name: 'status', type: 'string', default: 'active' }
            ]);
            
            const instance = user.instance();
            expect(instance.get('status')).to.equal('active');
        });
        
        it('should throw error for invalid field name', function() {
            const user = ActiveModel('user');
            
            expect(() => {
                user.addField({ name: '', type: 'string' });
            }).to.throw('invalid field name');
        });
        
        it('should handle setAttributes', function() {
            const user = ActiveModel('user', ['name', 'email', 'age']);
            const instance = user.instance();
            
            instance.setAttributes({
                name: 'Jane',
                email: 'jane@example.com',
                age: 25
            });
            
            expect(instance.get('name')).to.equal('Jane');
            expect(instance.get('email')).to.equal('jane@example.com');
            expect(instance.get('age')).to.equal(25);
        });
        
        it('should reflect fields correctly', function() {
            const user = ActiveModel('user', ['name', 'email']);
            const fields = user.reflect();
            
            expect(fields).to.be.an('array');
            expect(fields.length).to.be.at.least(2);
            
            const fieldNames = fields.map(f => f.name);
            expect(fieldNames).to.include('name');
            expect(fieldNames).to.include('email');
        });
    });
});
