#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } from "fs";
import { execFileSync } from "child_process";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";
import { parseArgs } from "util";
import kleur from "kleur";

var __dirname = dirname(fileURLToPath(import.meta.url));
var TEMPLATES_DIR = join(__dirname, "..", "templates");

var { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    description: { type: "string", short: "d" },
    help: { type: "boolean", short: "h" },
    "no-git": { type: "boolean" },
    "no-install": { type: "boolean" },
  },
  allowPositionals: true,
});

var name = positionals[0];

if (values.help) {
  console.log(`Usage: npx @shipcli/create <name> [options]

Options:
  -d, --description <text>  Set the package description
      --no-git              Skip git initialization
      --no-install          Skip npm install
  -h, --help                Show this help`);
  process.exit(0);
}

var VALID_NAME = /^[a-z][a-z0-9-]*$/;

if (!name) {
  console.error(kleur.red("Usage: npx @shipcli/create <name> [options]"));
  console.error(kleur.dim("  Example: npx @shipcli/create codeautopsy"));
  process.exit(1);
}

if (!VALID_NAME.test(name)) {
  console.error(kleur.red(`Invalid name: ${name}`));
  console.error(kleur.dim("  Use lowercase letters, numbers, and hyphens; start with a letter."));
  process.exit(1);
}

var description = values.description || positionals[1] || "A CLI tool built with shipcli";
var share = true;

console.log(`\n${kleur.bold().cyan("==>")} ${kleur.bold(`Creating ${name}...`)}\n`);

var outDir = join(process.cwd(), name);
if (existsSync(outDir) && readdirSync(outDir).length > 0) {
  console.error(kleur.red(`Cannot create ${name}: the destination directory is not empty.`));
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

function escapeTemplateString(value) {
  return JSON.stringify(value).slice(1, -1);
}

function processTemplates(dir, outBase) {
  var entries = readdirSync(dir);
  for (var entry of entries) {
    var srcPath = join(dir, entry);
    var stat = statSync(srcPath);

    if (stat.isDirectory()) {
      var subOut = join(outBase, entry);
      mkdirSync(subOut, { recursive: true });
      processTemplates(srcPath, subOut);
      continue;
    }

    if (!entry.endsWith(".tpl")) continue;

    var content = readFileSync(srcPath, "utf-8");
    content = content
      .replace(/\{\{name\}\}/g, escapeTemplateString(name))
      .replace(/\{\{description\}\}/g, escapeTemplateString(description))
      .replace(/\{\{share\}\}/g, String(share));

    var outName = entry.replace(".tpl", "");
    // gitignore → .gitignore
    if (outName === "gitignore") outName = ".gitignore";

    var outPath = join(outBase, outName);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, content);
    console.log(`    ${kleur.dim("created")} ${relative(outDir, outPath)}`);
  }
}

processTemplates(TEMPLATES_DIR, outDir);

if (!values["no-git"]) {
  try {
    execFileSync("git", ["init"], { cwd: outDir, stdio: "ignore" });
    console.log(`    ${kleur.dim("initialized")} git repository`);
  } catch {
    console.warn(kleur.yellow("    Git initialization skipped (git is not available)."));
  }
}

if (!values["no-install"]) {
  console.log(`\n${kleur.bold().cyan("==>")} ${kleur.bold("Installing dependencies...")}\n`);
  try {
    execFileSync("npm", ["install"], { cwd: outDir, stdio: "inherit" });
  } catch {
    console.error(kleur.red("Dependency installation failed."));
    console.error(kleur.dim(`  The project is available at ${outDir}; run npm install manually.`));
    process.exit(1);
  }
}

console.log(`\n${kleur.green("-->")} ${kleur.bold(name)} created!\n`);
console.log(`    ${kleur.dim("Next steps:")}`);
console.log(`    cd ${name}`);
if (values["no-install"]) console.log("    npm install");
console.log(`    npm start -- --help\n`);
