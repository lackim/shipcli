# @shipcli/create

Scaffold a small JavaScript CLI powered by `@shipcli/core`.

```bash
npx @shipcli/create my-cli
cd my-cli
npm start -- --help
```

Project names must use lowercase letters, numbers, and hyphens, and must start
with a letter. The generator refuses to overwrite a non-empty destination.
It initializes git and installs dependencies unless `--no-git` or
`--no-install` is passed.

See the [shipcli repository](https://github.com/lackim/shipcli) for the generated
project structure and the rest of the toolkit.
