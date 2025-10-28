/**
 * Validators tests for ActiveModel
 * Converted from JSpec to Mocha/Chai
 */

require('./setup');
const { expect } = require('chai');

describe('ActiveModel Validators', function() {
    
    describe('Validation Lifecycle', function() {
        
        it('should call beforeValidate hook', function() {
            const user = ActiveModel('user', ['name']);
            
            user.addProperty('beforeValidate', function() {
                this.addError('name', 'before Validate');
                return false;
            });
            
            const instance = user.instance();
            expect(instance.valid()).to.equal(false);
            expect(instance.errors).to.deep.equal({ name: ['before Validate'] });
        });
        
        it('should call afterValidate hook', function() {
            const user = ActiveModel('user', ['name']);
            
            user.addProperty('afterValidate', function() {
                this.addError('name', 'after Validate');
                return false;
            });
            
            const instance = user.instance();
            expect(instance.valid()).to.equal(false);
            expect(instance.errors).to.deep.equal({ name: ['after Validate'] });
        });
    });
    
    describe('Acceptance Validator', function() {
        
        it('should validate acceptance', function() {
            const user = ActiveModel('user', { name: 'terms', type: 'boolean' });
            user.validateAcceptance('terms', { qualifier: true });
            
            const instance = user.instance();
            expect(instance.valid()).to.equal(false);
            
            instance.set('terms', true);
            expect(instance.valid()).to.equal(true);
        });
    });
    
    describe('Presence Validator', function() {
        
        it('should validate presence for string fields', function() {
            const user = ActiveModel('user', ['name']);
            user.validatePresence('name');
            
            const instance = user.instance();
            expect(instance.valid()).to.equal(false);
            
            instance.set('name', 'John');
            expect(instance.valid()).to.equal(true);
        });
        
        it('should validate presence for number fields', function() {
            const user = ActiveModel('user', [{ name: 'age', type: 'number' }]);
            user.validatePresence('age');
            
            const instance = user.instance();
            expect(instance.valid()).to.equal(false);
            
            instance.set('age', 0);
            expect(instance.valid()).to.equal(true);
            
            instance.set('age', 25);
            expect(instance.valid()).to.equal(true);
        });
        
        it('should not allow empty strings', function() {
            const user = ActiveModel('user', ['name']);
            user.validatePresence('name');
            
            const instance = user.instance();
            instance.set('name', '   ');
            expect(instance.valid()).to.equal(false);
        });
    });
    
    describe('Length Validator', function() {
        
        it('should validate maximum length', function() {
            const user = ActiveModel('user', ['name']);
            user.validateLength('name', { maximum: 10 });
            
            const instance = user.instance();
            
            instance.set('name', 'Short');
            expect(instance.valid()).to.equal(true);
            
            instance.set('name', 'This is too long');
            expect(instance.valid()).to.equal(false);
        });
        
        it('should validate minimum length', function() {
            const user = ActiveModel('user', ['name']);
            user.validateLength('name', { minimum: 5 });
            
            const instance = user.instance();
            
            instance.set('name', 'Hi');
            expect(instance.valid()).to.equal(false);
            
            instance.set('name', 'Hello');
            expect(instance.valid()).to.equal(true);
        });
        
        it('should validate exact length', function() {
            const user = ActiveModel('user', ['code']);
            user.validateLength('code', { is: 5 });
            
            const instance = user.instance();
            
            instance.set('code', '1234');
            expect(instance.valid()).to.equal(false);
            
            instance.set('code', '12345');
            expect(instance.valid()).to.equal(true);
            
            instance.set('code', '123456');
            expect(instance.valid()).to.equal(false);
        });
    });
    
    describe('Numericality Validator', function() {
        
        it('should validate greater than with valid value', function() {
            const product = ActiveModel('product', [{ name: 'price', type: 'number' }]);
            product.validateNumericality('price', { greater_than: 0 });
            
            const instance = product.instance();
            instance.set('price', 10);
            expect(instance.valid()).to.equal(true);
        });
        
        it('should validate equal to', function() {
            const item = ActiveModel('item', [{ name: 'quantity', type: 'number' }]);
            item.validateNumericality('quantity', { equal_to: 5 });
            
            const instance = item.instance();
            
            instance.set('quantity', 3);
            expect(instance.valid()).to.equal(false);
            
            instance.set('quantity', 5);
            expect(instance.valid()).to.equal(true);
        });
    });
    
    describe('Error Management', function() {
        
        it('should add errors', function() {
            const user = ActiveModel('user', ['name']);
            const instance = user.instance();
            
            instance.addError('name', 'is required');
            expect(instance.errors).to.deep.equal({ name: ['is required'] });
        });
        
        it('should accumulate multiple errors', function() {
            const user = ActiveModel('user', ['name']);
            const instance = user.instance();
            
            instance.addError('name', 'is required');
            instance.addError('name', 'is too short');
            
            expect(instance.errors.name).to.have.lengthOf(2);
            expect(instance.errors.name).to.include('is required');
            expect(instance.errors.name).to.include('is too short');
        });
    });
});
