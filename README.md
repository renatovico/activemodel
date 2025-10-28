# ActiveModel for JavaScript

A JavaScript model framework inspired by Ruby on Rails ActiveModel, providing validation, associations, and CRUD operations. **Now jQuery-free - uses only plain JavaScript!**

## Features

- **Model Definition**: Define models with fields and types
- **Validations**: Built-in validators for common use cases
- **Associations**: Support for model relationships
- **CRUD Operations**: Create, Read, Update, Delete functionality
- **Single Table Inheritance (STI)**: Model inheritance support
- **Reflection**: Introspect model structure and metadata
- **jQuery-free**: Self-contained with bundled utilities

## Installation

```bash
# Clone the repository
git clone https://github.com/renatovico/activemodel.git
cd activemodel

# Build the project
npm run build
```

## Usage

### Basic Model Definition

```javascript
// Define a simple model
var User = ActiveModel('user', ['name', 'email', 'age']);

// Create an instance
var user = User.instance();

// Set values
user.set('name', 'John Doe');
user.set('email', 'john@example.com');
user.set('age', 30);

// Get values
console.log(user.get('name')); // "John Doe"

// Get all values as object
console.log(user.values()); // {name: "John Doe", email: "john@example.com", age: 30}

// Set multiple attributes at once
user.setAttributes({
  name: 'Jane Smith',
  email: 'jane@example.com',
  age: 28
});
```

### Model with Field Types

```javascript
// Define model with explicit field types
var Product = ActiveModel('product', [
  { name: 'title', type: 'string' },
  { name: 'price', type: 'number' },
  { name: 'inStock', type: 'boolean' },
  { name: 'releaseDate', type: 'date' }
]);

var product = Product.instance();
product.setAttributes({
  title: 'Laptop',
  price: 999.99,
  inStock: true,
  releaseDate: '2024-01-15T00:00:00'
});
```

### Validations

ActiveModel provides powerful validation capabilities:

```javascript
// Define model with validations
var User = ActiveModel('user', ['name', 'email', 'age', 'terms', 'password', 'password_confirmation']);

// Presence validation
User.validatePresence(['name', 'email']);

// Length validation
User.validateLength('name', { minimum: 2, maximum: 50 });
User.validateLength('password', { minimum: 8 });

// Format validation (email)
User.validateFormat('email', { with: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' });

// Numericality validation
User.validateNumericality('age', { greater_than: 18 });

// Acceptance validation (for terms of service)
User.validateAcceptance('terms', { qualifier: true });

// Confirmation validation (for password confirmation)
User.validateConfirmation('password');

// Validate an instance
var user = User.instance();
user.setAttributes({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  terms: true,
  password: 'securepass123',
  password_confirmation: 'securepass123'
});

if (user.valid()) {
  console.log('User is valid!');
} else {
  console.log('Validation errors:', user.errors);
}
```

### Validation Lifecycle Hooks

```javascript
var User = ActiveModel('user', ['name', 'email']);

// Add beforeValidate hook
User.addProperty('beforeValidate', function() {
  // Normalize email before validation
  if (this.get('email')) {
    this.set('email', this.get('email').toLowerCase());
  }
  return true; // Return false to stop validation
});

// Add afterValidate hook
User.addProperty('afterValidate', function() {
  // Custom validation logic
  if (this.get('email') && this.get('email').indexOf('@company.com') === -1) {
    this.addError('email', 'Must be a company email');
    return false;
  }
  return true;
});
```

### Associations

#### belongsTo

```javascript
var User = ActiveModel('user', ['name', 'email']);
var Post = ActiveModel('post', ['title', 'content']);

// Post belongs to User
Post.belongsTo(User);

var user = User.instance();
user.setAttributes({ id: 1, name: 'John Doe' });

var post = Post.instance();
post.set('title', 'My First Post');
post.set('user', user);

console.log(post.get('user_id')); // 1
console.log(post.get('user').get('name')); // "John Doe"

// Using build method
var newPost = Post.instance();
newPost.build_user({ name: 'Jane Smith', email: 'jane@example.com' });
```

#### hasOne

```javascript
var User = ActiveModel('user', ['name']);
var Profile = ActiveModel('profile', ['bio', 'avatar']);

// User has one Profile
User.hasOne(Profile);

var user = User.instance();
user.set('name', 'John Doe');

// Set profile
user.set('profile', { bio: 'Software developer', avatar: 'avatar.jpg' });

console.log(user.get('profile').get('bio')); // "Software developer"

// Using build method
user.build_profile({ bio: 'Designer', avatar: 'designer.jpg' });
```

#### hasMany

```javascript
var Author = ActiveModel('author', ['name']);
var Book = ActiveModel('book', ['title', 'isbn']);

// Author has many Books
Author.hasMany(Book);

var author = Author.instance();
author.set('name', 'J.K. Rowling');

// Set multiple books
author.set('books', [
  { title: 'Harry Potter 1', isbn: '123' },
  { title: 'Harry Potter 2', isbn: '124' }
]);

console.log(author.get('books').length); // 2
console.log(author.get('books')[0].get('title')); // "Harry Potter 1"

// Build and add a new book
author.build_book({ title: 'Harry Potter 3', isbn: '125' });
```

### Nested Validations

```javascript
var User = ActiveModel('user', ['name', 'email']);
var Post = ActiveModel('post', ['title', 'content']);

Post.belongsTo(User);

// Validate associated models
Post.validatePresence(['title', 'content']);
Post.validateAssociated('user');

User.validatePresence(['name', 'email']);

var post = Post.instance();
post.setAttributes({
  title: 'My Post',
  content: 'Post content',
  user: { name: '', email: 'invalid' } // Invalid user
});

// This will validate both Post and User
var isValid = post.valid();
console.log('Post valid:', isValid);
console.log('Errors:', post.errors);
```

### Reflection

```javascript
var User = ActiveModel('user', [
  { name: 'id', type: 'number' },
  { name: 'name', type: 'string' },
  { name: 'email', type: 'string' },
  { name: 'age', type: 'number' }
]);

// Reflect on model structure
var fields = User.reflect();
console.log('Model fields:', fields);
// [
//   { name: 'id', type: 'number' },
//   { name: 'name', type: 'string' },
//   { name: 'email', type: 'string' },
//   { name: 'age', type: 'number' }
// ]

// Instance reflection
var user = User.instance();
var instanceFields = user.reflect();
console.log('Instance fields:', instanceFields);
```

### Single Table Inheritance (STI)

```javascript
// Define base model
var Vehicle = ActiveModel('vehicle', ['make', 'model', 'year']);

// Create submodels
var Car = Vehicle.sti('car', ['numDoors']);
var Motorcycle = Vehicle.sti('motorcycle', ['engineSize']);

// Car inherits all Vehicle fields plus numDoors
var myCar = Car.instance();
myCar.setAttributes({
  make: 'Toyota',
  model: 'Camry',
  year: 2024,
  numDoors: 4
});

// Motorcycle inherits all Vehicle fields plus engineSize
var myBike = Motorcycle.instance();
myBike.setAttributes({
  make: 'Harley-Davidson',
  model: 'Street 750',
  year: 2024,
  engineSize: 750
});

console.log(myCar.documentType); // "car"
console.log(myBike.documentType); // "motorcycle"
```

### Additional Validators

#### Inclusion and Exclusion

```javascript
var Product = ActiveModel('product', ['category', 'status']);

// Inclusion - value must be in list
Product.validateInclusion('category', { 
  qualifier: { 'electronics': true, 'books': true, 'clothing': true },
  message: 'Invalid category'
});

// Exclusion - value must NOT be in list
Product.validateExclusion('status', { 
  qualifier: { 'deleted': true, 'archived': true },
  message: 'Cannot use this status'
});

var product = Product.instance();
product.set('category', 'electronics'); // Valid
product.set('status', 'active'); // Valid
console.log(product.valid()); // true
```

#### Each Validator

```javascript
// Validate each element in a collection
var Form = ActiveModel('form', ['tags']);

Form.validateEach('tags', function(field, value) {
  if (!value || value.length < 3) {
    this.addError(field, 'Each tag must be at least 3 characters');
    return false;
  }
  return true;
});

var form = Form.instance();
form.set('tags', ['js', 'web', 'dev']);
console.log(form.valid()); // false - 'js' is too short
```

### Custom Validators

```javascript
var User = ActiveModel('user', ['username', 'age']);

// Add custom validation logic
User.addProperty('validate', function() {
  var username = this.get('username');
  if (username && username.indexOf('admin') !== -1) {
    this.addError('username', 'Username cannot contain "admin"');
    return false;
  }
  
  var age = this.get('age');
  if (age && age < 18) {
    this.addError('age', 'Must be at least 18 years old');
    return false;
  }
  
  return true;
});

var user = User.instance();
user.setAttributes({ username: 'admin123', age: 16 });
console.log(user.valid()); // false
console.log(user.errors); // { username: [...], age: [...] }
```

### Working with Nested Attributes

```javascript
var Company = ActiveModel('company', ['name', 'address']);
var Address = ActiveModel('address', ['street', 'city', 'zipCode']);

Company.hasOne(Address);
Address.validatePresence(['street', 'city', 'zipCode']);

var company = Company.instance();
company.set('name', 'Tech Corp');
company.set('address', {
  street: '123 Main St',
  city: 'San Francisco',
  zipCode: '94102'
});

// Serialize with nested attributes
var data = company.values();
console.log(data);
// {
//   name: 'Tech Corp',
//   address: { street: '123 Main St', city: 'San Francisco', zipCode: '94102' }
// }
```

### Conditional Validations

```javascript
var Order = ActiveModel('order', ['shippingMethod', 'shippingAddress']);

// Validate shippingAddress only when shippingMethod is 'delivery'
Order.addProperty('validate', function() {
  if (this.get('shippingMethod') === 'delivery') {
    if (!this.get('shippingAddress')) {
      this.addError('shippingAddress', 'Required for delivery');
      return false;
    }
  }
  return true;
});
```

### Error Handling

```javascript
var User = ActiveModel('user', ['name', 'email']);
User.validatePresence(['name', 'email']);
User.validateFormat('email', { with: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ });

var user = User.instance();
user.set('name', '');
user.set('email', 'invalid-email');

if (!user.valid()) {
  // Access errors for specific fields
  console.log(user.errors.name); // Array of error messages
  console.log(user.errors.email); // Array of error messages
  
  // Manually add errors
  user.addError('name', 'Custom error message');
  
  // Clear all errors
  user.errors = {};
}
```

## Available Validators

| Validator | Description | Options |
|-----------|-------------|---------|
| `validatePresence` | Ensures field is not empty | - |
| `validateAcceptance` | Validates boolean acceptance (e.g., terms) | `qualifier` |
| `validateConfirmation` | Validates field matches confirmation field | - |
| `validateLength` | Validates string length | `minimum`, `maximum`, `is` |
| `validateNumericality` | Validates numeric values | `greater_than`, `less_than`, `equal_to` |
| `validateFormat` | Validates against regex pattern | `with`, `message` |
| `validateInclusion` | Value must be in list | `qualifier` (hash map), `message` |
| `validateExclusion` | Value must NOT be in list | `qualifier` (hash map), `message` |
| `validateAssociated` | Validates associated models | - |
| `validateEach` | Custom validator for each element | callback function |

## Building

The project uses a build script to concatenate all source files:

```bash
npm run build
```

This generates `railsDocument.js` from the source files in the `lib/` directory.

## Project Structure

```
activemodel/
├── lib/              # Source files
│   ├── utils.js      # Plain JavaScript utilities (replaces jQuery)
│   ├── core.js       # Core functionality
│   ├── validators.js # Validation logic
│   ├── associations.js # Model associations
│   ├── crud.js       # CRUD operations
│   ├── sti.js        # Single Table Inheritance
│   ├── gettext.js    # Internationalization
│   └── reflect.js    # Reflection API
├── vendor/           # Third-party utilities (date, inflection, i18n)
├── spec/             # Test specifications
├── build.js          # Build script
└── railsDocument.js  # Generated output file (gitignored)
```

## Requirements

- Node.js >= 14.0.0 (for building only)
- No runtime dependencies required

## License

MIT

## Author

Renato Elias
