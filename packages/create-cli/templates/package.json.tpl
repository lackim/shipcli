{
  "name": "{{name}}",
  "version": "0.1.0",
  "description": "{{description}}",
  "type": "module",
  "bin": {
    "{{name}}": "./dist/cli.js"
  },
  "files": ["dist"],
  "keywords": ["cli", "{{name}}"],
  "license": "MIT",
  "shipcli": {
    "entrypoint": "./src/cli.ts"
  },
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "dev": "tsx src/cli.ts",
    "prepack": "npm run build",
    "start": "tsx src/cli.ts",
    "test": "tsx --test test/*.test.ts",
    "typecheck": "tsc -p tsconfig.json"
  },
  "engines": {
    "node": ">=20"
  },
  "dependencies": {
    "@shipcli/core": "{{shipcliVersion}}",
    "@shipcli/share": "{{shipcliVersion}}"
  },
  "devDependencies": {
    "@types/node": "^20.19.0",
    "tsx": "^4.20.0",
    "typescript": "^5.9.0"
  }
}
