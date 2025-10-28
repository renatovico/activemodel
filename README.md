# ActiveModel for JavaScript

A JavaScript model framework inspired by Ruby on Rails ActiveModel, providing validation, associations, and CRUD operations.

## Features

- **Model Definition**: Define models with fields and types
- **Validations**: Built-in validators for common use cases
- **Associations**: Support for model relationships
- **CRUD Operations**: Create, Read, Update, Delete functionality
- **Single Table Inheritance (STI)**: Model inheritance support
- **Reflection**: Introspect model structure and metadata

## Installation

```bash
# Clone the repository
git clone https://github.com/renatovico/activemodel.git
cd activemodel

# Build the project
npm run build
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
│   ├── core.js       # Core functionality
│   ├── validators.js # Validation logic
│   ├── associations.js # Model associations
│   ├── crud.js       # CRUD operations
│   ├── sti.js        # Single Table Inheritance
│   ├── gettext.js    # Internationalization
│   └── reflect.js    # Reflection API
├── vendor/           # Third-party dependencies
├── spec/             # Test specifications
├── build.js          # Build script
└── railsDocument.js  # Generated output file
```

## Requirements

- Node.js >= 14.0.0

## License

MIT

## Author

Renato Elias
