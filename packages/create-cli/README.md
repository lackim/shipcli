# @shipcli/create

Scaffold a small TypeScript CLI powered by `@shipcli/core`.

```bash
npx @shipcli/create my-cli
cd my-cli
npm start -- --help
```

## Options

```text
-d, --description <text>  Set the package description
    --no-git              Skip git initialization
    --no-install          Skip dependency installation
-h, --help                Show help
```

Project names must use lowercase letters, numbers, and hyphens, and must start
with a letter. The generator refuses to overwrite a non-empty destination. It
initializes git and installs dependencies unless `--no-git` or `--no-install`
is passed.

The generated project includes strict TypeScript configuration, a typed
`shipcli.config.ts`, tests, GitHub Actions CI, structured JSON output, and an
optional offline share-card example.

[Generated project guide](https://lackim.github.io/shipcli/docs#project-structure) ·
[Source](https://github.com/lackim/shipcli/tree/main/packages/create-cli) ·
[Changelog](https://github.com/lackim/shipcli/blob/main/packages/create-cli/CHANGELOG.md)
