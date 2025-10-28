# ActiveModel for JavaScript

A JavaScript model framework inspired by Ruby on Rails ActiveModel, providing validation, associations, and CRUD operations. **Now with zero dependencies - uses only plain JavaScript!**

## Features

- **Model Definition**: Define models with fields and types
- **Validations**: Built-in validators for common use cases
- **Associations**: Support for model relationships
- **CRUD Operations**: Create, Read, Update, Delete functionality
- **Single Table Inheritance (STI)**: Model inheritance support
- **Reflection**: Introspect model structure and metadata
- **Pure JavaScript**: No external dependencies - no jQuery required!

## Installation

```bash
# Clone the repository
git clone https://github.com/renatovico/activemodel.git
cd activemodel

# Build the project
npm run build
```

## Usage

```javascript
// Define a model
var User = ActiveModel('User', ['name', 'email', 'age']);

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
```

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

- Node.js >= 14.0.0
- No external runtime dependencies

## License

MIT

## Author

Renato Elias
