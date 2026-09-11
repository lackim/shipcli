#!/usr/bin/env node

import { createCLI } from "@shipcli/core/cli";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { run } from "./commands/index.js";

var __dirname = dirname(fileURLToPath(import.meta.url));
var pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8"));

var cli = createCLI({
  name: "{{name}}",
  packageName: pkg.name,
  description: "{{description}}",
  version: pkg.version,
});

cli
  .argument("[target]", "Target to analyze")
  .option("--share", "Generate shareable output")
  .action(run);

cli.run();
