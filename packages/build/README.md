# @shipcli/build

Typed release and distribution helpers for TypeScript CLI projects.

```bash
npm install @shipcli/build
```

Exports include:

- `publish` for version bumps and npm publication
- `build` for cross-platform binaries compiled with Bun
- `generateFormula` for Homebrew formulae
- `generateChangelog` for changelogs derived from git history

Most users should install `@shipcli/cli` and access these helpers through the
`shipcli` command. See the
[shipcli repository](https://github.com/lackim/shipcli) for usage and safety notes.
