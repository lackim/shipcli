#!/usr/bin/env node

import { mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";
import kleur from "kleur";

var __dirname = dirname(fileURLToPath(import.meta.url));
var TEMPLATES_DIR = join(__dirname, "..", "templates");

var args = process.argv.slice(2);
var name = args[0];

if (!name) {
  console.error(kleur.red("Usage: create-shipcli <name>"));
  console.error(kleur.dim("  Example: npx create-shipcli codeautopsy"));
  process.exit(1);
}

var description = args[1] || `A CLI tool built with shipcli`;
var share = true;

console.log(`\n${kleur.bold().cyan("==>")} ${kleur.bold(`Creating ${name}...`)}\n`);

var outDir = join(process.cwd(), name);
mkdirSync(outDir, { recursive: true });

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
      .replace(/\{\{name\}\}/g, name)
      .replace(/\{\{description\}\}/g, description)
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

console.log(`\n${kleur.green("-->")} ${kleur.bold(name)} created!\n`);
console.log(`    ${kleur.dim("Next steps:")}`);
console.log(`    cd ${name}`);
console.log(`    npm install`);
console.log(`    node src/cli.js --help\n`);
