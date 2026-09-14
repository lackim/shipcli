#!/usr/bin/env node

import { createCLI, success } from "@shipcli/core";

const cli = createCLI({
  name: "hello-cli",
  packageName: "shipcli-example-hello",
  description: "A minimal shipcli example",
  version: "0.0.0",
});

cli
  .argument("[name]", "Name to greet", "world")
  .action((name: string, options: { json?: boolean }) => {
    const result = { greeting: `Hello, ${name}!` };
    if (options.json) console.log(JSON.stringify(result));
    else success(result.greeting);
  });

await cli.run();
