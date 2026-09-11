{
  "name": "{{name}}",
  "version": "0.1.0",
  "description": "{{description}}",
  "type": "module",
  "bin": {
    "{{name}}": "./src/cli.js"
  },
  "files": ["src"],
  "keywords": ["cli", "{{name}}"],
  "license": "MIT",
  "scripts": {
    "start": "node src/cli.js",
    "test": "node --test"
  },
  "engines": {
    "node": ">=20"
  },
  "dependencies": {
    "@shipcli/core": "^0.1.2"
  }
}
