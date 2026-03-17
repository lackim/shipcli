#!/usr/bin/env node

import { createCLI } from "@shipcli/core/cli";
import { run } from "./commands/index.js";

var cli = createCLI({
  name: "{{name}}",
  description: "{{description}}",
  version: "0.1.0",
  configDir: ".{{name}}",
});

cli
  .argument("[target]", "Target to analyze")
  .option("--share", "Generate shareable output")
  .action(run);

cli.run();
