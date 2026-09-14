# @shipcli/cli

The top-level command for the shipcli build and distribution toolkit. Requires
Node.js 24 or newer; standalone binary builds additionally require Bun.

```bash
npm install --global @shipcli/cli
shipcli --help
```

## Commands

```text
shipcli init [name]       Scaffold a TypeScript CLI project
shipcli publish           Version, check, and publish an npm package
shipcli build             Compile standalone binaries with Bun
shipcli homebrew          Generate a Homebrew formula
shipcli changelog         Generate a changelog from git history
shipcli landing init      Scaffold a Next.js landing page
```

Start a project without installing dependencies immediately:

```bash
shipcli init my-cli --description "A useful command-line tool" --no-install
```

Project defaults can live in a typed `shipcli.config.ts`. Explicit command-line
options take precedence over the config file.

```ts
import { defineConfig } from "@shipcli/core";

export default defineConfig({
  build: { targets: ["macos-arm64", "linux-x64"] },
  publish: { access: "public", bump: "patch" },
  landing: { outDir: "web" },
});
```

shipcli is currently in early access. Review a release with
`shipcli publish --dry-run` before publishing.

[Full documentation](https://lackim.github.io/shipcli/docs) ·
[Source](https://github.com/lackim/shipcli) ·
[Changelog](https://github.com/lackim/shipcli/blob/main/packages/cli/CHANGELOG.md)
