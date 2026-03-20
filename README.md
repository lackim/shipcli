# shipcli

CLI-as-a-Product toolkit — build, publish, and promote CLI tools with viral sharing features.

## Quick Start

```bash
npx create-shipcli my-cli
cd my-cli
node src/cli.js --help
```

## What You Get

A scaffolded CLI project with:

- **@shipcli/core** — CLI framework (output formatting, config, spinner, update check)
- **@shipcli/share** — `--share` flag generates OG images for X/LinkedIn
- **@shipcli/build** — npm publish, cross-platform binaries, Homebrew formulas
- **@shipcli/landing** — Next.js landing page with terminal demo

## Commands

```bash
shipcli init [name]       # Scaffold a new CLI tool
shipcli publish           # Version bump, git tag, npm publish
shipcli build             # Cross-platform binaries (Bun)
shipcli homebrew          # Generate Homebrew formula
shipcli changelog         # Generate CHANGELOG.md from git
shipcli landing init      # Scaffold a Next.js landing page
```

## Packages

| Package | Description |
|---------|-------------|
| [@shipcli/core](https://www.npmjs.com/package/@shipcli/core) | CLI framework: output, config, commands, spinner |
| [@shipcli/share](https://www.npmjs.com/package/@shipcli/share) | OG image generation for viral sharing |
| [@shipcli/build](https://www.npmjs.com/package/@shipcli/build) | npm publish, binary builds, Homebrew formulas |
| [@shipcli/landing](https://www.npmjs.com/package/@shipcli/landing) | Next.js landing page scaffolding |
| [@shipcli/create](https://www.npmjs.com/package/@shipcli/create) | `npx create-shipcli` scaffolding |
| [@shipcli/cli](https://www.npmjs.com/package/@shipcli/cli) | shipcli CLI orchestrator |

## Built with shipcli

- [codeautopsy](https://github.com/lackim/codeautopsy) — Post-mortem analysis of dead GitHub repos
- [saas-autopsy](https://github.com/lackim/saas-autopsy) — SaaS startup health analysis powered by TrustMRR

## License

MIT
