# hello-cli example

A minimal shipcli application kept in the monorepo as an executable example.

```bash
pnpm install
pnpm --filter shipcli-example-hello start Ada
pnpm --filter shipcli-example-hello start Ada --json
```

The example demonstrates `createCLI`, human-readable stderr output, structured
JSON stdout, and a typed `shipcli.config.ts`.
