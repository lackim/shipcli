import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";
import { phase, status, success, fatal, fmt } from "@shipcli/core/output";

var __dirname = dirname(fileURLToPath(import.meta.url));
var TEMPLATES_DIR = join(__dirname, "..", "templates");

export function scaffoldLanding(options = {}) {
  var cwd = options.cwd || process.cwd();
  var name = options.name;
  var description = options.description || "A CLI tool built with shipcli";

  if (!name) {
    // Try to read from package.json
    try {
      var pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf-8"));
      name = pkg.name;
      description = pkg.description || description;
    } catch {
      fatal("No project name specified.", "Run from a CLI project root or pass --name.");
    }
  }

  var outDir = join(cwd, "web");
  if (existsSync(outDir) && readdirSync(outDir).length > 0 && !options.force) {
    fatal("The web/ directory is not empty.", "Move it, remove it, or pass --force to overwrite template files.");
  }

  phase(`Scaffolding landing page for ${fmt.app(name)}`);

  mkdirSync(outDir, { recursive: true });
  processDir(TEMPLATES_DIR, outDir, { name, description }, outDir);

  success(`Landing page created in ${fmt.url("web/")}`);
  status("");
  status(`${fmt.dim("Next steps:")}`);
  status(`cd web`);
  status(`npm install`);
  status(`npm run dev`);
  status("");
}

function escapeTemplateString(value) {
  return JSON.stringify(String(value)).slice(1, -1);
}

function escapeJsxText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
}

function processDir(srcDir, outBase, vars, rootOut) {
  var entries = readdirSync(srcDir);
  for (var entry of entries) {
    var srcPath = join(srcDir, entry);
    var stat = statSync(srcPath);

    if (stat.isDirectory()) {
      var subOut = join(outBase, entry);
      mkdirSync(subOut, { recursive: true });
      processDir(srcPath, subOut, vars, rootOut);
      continue;
    }

    if (!entry.endsWith(".tpl")) continue;

    var content = readFileSync(srcPath, "utf-8");
    content = content
      .replace(/\{\{nameText\}\}/g, escapeJsxText(vars.name))
      .replace(/\{\{descriptionText\}\}/g, escapeJsxText(vars.description))
      .replace(/\{\{name\}\}/g, escapeTemplateString(vars.name))
      .replace(/\{\{description\}\}/g, escapeTemplateString(vars.description));

    var outName = entry.replace(".tpl", "");
    var outPath = join(outBase, outName);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, content);
    status(`${fmt.dim("created")} ${relative(rootOut, outPath)}`);
  }
}
