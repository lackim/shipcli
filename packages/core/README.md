# @shipcli/core

Typed primitives for building TypeScript command-line applications with shipcli.

```bash
npm install @shipcli/core
```

```ts
import { createCLI, success } from "@shipcli/core";

const cli = createCLI({
  name: "hello-cli",
  description: "Say hello",
  version: "1.0.0",
});

cli.argument("[name]", "Name to greet", "world").action((name) => {
  success(`Hello, ${name}!`);
});

await cli.run();
```

## Public modules

| Import | Purpose |
| --- | --- |
| `@shipcli/core` | Main API and shared types |
| `@shipcli/core/cli` | Commander-based CLI factory |
| `@shipcli/core/output` | Status output, tables, boxes, and formatting |
| `@shipcli/core/config` | Persistent per-user JSON configuration |
| `@shipcli/core/project-config` | Typed `shipcli.config.ts` helpers |
| `@shipcli/core/spinner` | Lightweight async spinner |

Project defaults can be defined without losing type checking:

```ts
import { defineConfig } from "@shipcli/core";

export default defineConfig({
  build: { entrypoint: "./src/cli.ts", outDir: "dist" },
  share: { enabled: true },
});
```

`createCLI().run()` is asynchronous, so call it with `await cli.run()` after
registering commands.

[API guide](https://lackim.github.io/shipcli/docs#create-cli) ·
[Source](https://github.com/lackim/shipcli/tree/main/packages/core) ·
[Changelog](https://github.com/lackim/shipcli/blob/main/packages/core/CHANGELOG.md)
