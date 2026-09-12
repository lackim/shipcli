#!/usr/bin/env node

import { createCLI } from "@shipcli/core/cli";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "./commands/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8")) as {
  name: string;
  version: string;
};

const cli = createCLI({
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
