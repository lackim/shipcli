import {
  existsSync,
  lstatSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
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
  repositoryUrl: string;
}

export function scaffoldLanding(options: ScaffoldLandingOptions = {}): void {
  const cwd = options.cwd || process.cwd();
  let name = options.name;
  let description = options.description || "A CLI tool built with shipcli";
  let repositoryUrl = "";

  try {
    const pkg: unknown = JSON.parse(readFileSync(join(cwd, "package.json"), "utf-8"));
    if (pkg && typeof pkg === "object" && !Array.isArray(pkg)) {
      const metadata = pkg as Record<string, unknown>;
      if (!name && typeof metadata.name === "string") name = metadata.name;
      if (!options.description && typeof metadata.description === "string") {
        description = metadata.description;
      }
      repositoryUrl = normalizeRepositoryUrl(metadata.repository);
    }
  } catch {
    if (!name) {
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
  processDir(TEMPLATES_DIR, outDir, { name, description, repositoryUrl }, outDir);

  success(`Landing page created in ${fmt.url(relativeOutDir + "/")}`);
  status("");
  status(`${fmt.dim("Next steps:")}`);
  status(`cd ${relativeOutDir}`);
  status(`npm install`);
  status(`npm run dev`);
  status("");
}

export function normalizeRepositoryUrl(repository: unknown): string {
  const raw = typeof repository === "string"
    ? repository
    : repository && typeof repository === "object" && !Array.isArray(repository)
      && typeof (repository as Record<string, unknown>).url === "string"
      ? (repository as Record<string, string>).url
      : "";

  const normalized = raw
    .replace(/^git\+/, "")
    .replace(/^git:\/\/github\.com\//, "https://github.com/")
    .replace(/^git@github\.com:/, "https://github.com/")
    .replace(/\.git$/, "");

  try {
    const url = new URL(normalized);
    if (url.protocol !== "https:" || url.username || url.password) return "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
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

  // A lexical containment check is not enough: an existing symlink such as
  // web -> ../.. would redirect generated files outside the project.
  let current = root;
  for (const part of relativePath.split(sep)) {
    current = join(current, part);
    const metadata = lstatSync(current, { throwIfNoEntry: false });
    if (!metadata) break;
    if (metadata.isSymbolicLink()) {
      throw new Error(`Output directory cannot contain symbolic links: ${outDir}`);
    }
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
      .replace(/\{\{repositoryUrl\}\}/g, escapeTemplateString(vars.repositoryUrl))
      .replace(/\{\{name\}\}/g, escapeTemplateString(vars.name))
      .replace(/\{\{description\}\}/g, escapeTemplateString(vars.description));

    const outName = entry.replace(".tpl", "");
    const outPath = join(outBase, outName);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, content);
    status(`${fmt.dim("created")} ${relative(rootOut, outPath)}`);
  }
}
