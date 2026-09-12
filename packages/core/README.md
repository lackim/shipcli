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

cli.run();
```

The package also exports configuration storage, formatted output, spinners,
error handling, and update checks. See the
[shipcli repository](https://github.com/lackim/shipcli) for status and support.
