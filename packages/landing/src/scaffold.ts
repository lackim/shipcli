import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { phase, status, success, fatal, fmt } from "@shipcli/core/output";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, "..", "templates");

export interface ScaffoldLandingOptions {
  cwd?: string;
  name?: string;
  description?: string;
  outDir?: string;
  force?: boolean;
}

interface TemplateVariables {
  name: string;
  description: string;
}

export function scaffoldLanding(options: ScaffoldLandingOptions = {}): void {
  const cwd = options.cwd || process.cwd();
  let name = options.name;
  let description = options.description || "A CLI tool built with shipcli";

  if (!name) {
    // Try to read from package.json
    try {
      const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf-8"));
      name = pkg.name;
      description = pkg.description || description;
    } catch {
      fatal("No project name specified.", "Run from a CLI project root or pass --name.");
    }
  }

  if (!name) fatal("No project name specified.");

  const relativeOutDir = options.outDir || "web";
  let outDir: string;
  try {
    outDir = resolveLandingOutDir(cwd, relativeOutDir);
  } catch (cause) {
    fatal(
      "The landing page output directory must stay inside the project.",
      cause instanceof Error ? cause.message : String(cause),
    );
  }
  if (existsSync(outDir) && readdirSync(outDir).length > 0 && !options.force) {
    fatal(
      `The ${relativeOutDir}/ directory is not empty.`,
      "Move it, remove it, or pass --force to overwrite template files.",
    );
  }

  phase(`Scaffolding landing page for ${fmt.app(name)}`);

  mkdirSync(outDir, { recursive: true });
  processDir(TEMPLATES_DIR, outDir, { name, description }, outDir);

  success(`Landing page created in ${fmt.url(relativeOutDir + "/")}`);
  status("");
  status(`${fmt.dim("Next steps:")}`);
  status(`cd ${relativeOutDir}`);
  status(`npm install`);
  status(`npm run dev`);
  status("");
}

export function resolveLandingOutDir(cwd: string, outDir: string): string {
  const root = resolve(cwd);
  const target = resolve(root, outDir);
  const relativePath = relative(root, target);
  if (
    relativePath.length === 0
    || relativePath === ".."
    || relativePath.startsWith(`..${sep}`)
    || isAbsolute(relativePath)
  ) {
    throw new Error(`Invalid output directory: ${outDir}`);
  }
  return target;
}

function escapeTemplateString(value: unknown): string {
  return JSON.stringify(String(value)).slice(1, -1);
}

function escapeJsxText(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
}

function processDir(
  srcDir: string,
  outBase: string,
  vars: TemplateVariables,
  rootOut: string,
): void {
  const entries = readdirSync(srcDir);
  for (const entry of entries) {
    const srcPath = join(srcDir, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      const subOut = join(outBase, entry);
      mkdirSync(subOut, { recursive: true });
      processDir(srcPath, subOut, vars, rootOut);
      continue;
    }

    if (!entry.endsWith(".tpl")) continue;

    let content = readFileSync(srcPath, "utf-8");
    content = content
      .replace(/\{\{nameText\}\}/g, escapeJsxText(vars.name))
      .replace(/\{\{descriptionText\}\}/g, escapeJsxText(vars.description))
      .replace(/\{\{name\}\}/g, escapeTemplateString(vars.name))
      .replace(/\{\{description\}\}/g, escapeTemplateString(vars.description));

    const outName = entry.replace(".tpl", "");
    const outPath = join(outBase, outName);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, content);
    status(`${fmt.dim("created")} ${relative(rootOut, outPath)}`);
  }
}
