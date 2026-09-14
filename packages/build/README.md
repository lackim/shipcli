# @shipcli/build

Typed release and distribution helpers for TypeScript CLI projects.

```bash
npm install @shipcli/build
```

Exports include:

- `publish` for version bumps and npm publication
- `build` and `selectTargets` for cross-platform binaries compiled with Bun
- `generateFormula` for Homebrew formulae
- `generateChangelog` for changelogs derived from git history

## Examples

```ts
import { build, selectTargets } from "@shipcli/build/binary";

build({
  entrypoint: "./src/cli.ts",
  outDir: "bin",
  targets: selectTargets(["macos-arm64", "linux-x64"]),
});
```

```ts
import { publish } from "@shipcli/build/npm-publish";

publish({ bump: "patch", access: "public", dryRun: true });
```

Binary builds require Bun. `publish()` requires a clean git working tree unless
`skipGit` is set intentionally. Start with a dry run; it invokes npm's package
check without changing the version, commit history, or tags.

Most users should install `@shipcli/cli` and access these helpers through the
`shipcli` command.

[Build guide](https://lackim.github.io/shipcli/docs#build) ·
[Source](https://github.com/lackim/shipcli/tree/main/packages/build) ·
[Changelog](https://github.com/lackim/shipcli/blob/main/packages/build/CHANGELOG.md)
