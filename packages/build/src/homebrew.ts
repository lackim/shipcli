import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { phase, success, fatal, fmt } from "@shipcli/core/output";
import type { PackageJson } from "./types.js";

export interface FormulaOptions {
  cwd?: string;
  repo?: string;
  output?: string;
}

export interface FormulaResult {
  path: string;
  className: string;
  name: string;
}

const VALID_REPO = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;
const VALID_PACKAGE_NAME = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/;
const VALID_VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/;

export function isValidFormulaPackageName(value: string): boolean {
  return VALID_PACKAGE_NAME.test(value);
}

function rubyStringLiteral(value: string): string {
  // Single-quoted Ruby strings do not evaluate #{...}. Normalize control
  // characters as well so package metadata cannot inject additional code.
  const sanitized = value.replace(/[\u0000-\u001f\u007f-\u009f]/g, " ");
  return `'${sanitized.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

export function generateFormula(options: FormulaOptions = {}): FormulaResult {
  const cwd = options.cwd || process.cwd();
  const pkgPath = join(cwd, "package.json");
  let pkg: PackageJson;

  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    fatal("No package.json found.", "Run this command from a CLI project root.");
  }

  if (!isValidFormulaPackageName(pkg.name)) {
    fatal(`Invalid package name: ${pkg.name}`, "Use a valid lowercase npm package name.");
  }
  if (!VALID_VERSION.test(pkg.version)) {
    fatal(`Invalid package version: ${pkg.version}`, "Use a stable semantic version.");
  }

  const name = pkg.name.replace(/^@[^/]+\//, ""); // strip scope
  const className = name
    .split(/[-_.]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  const repositoryUrl = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
  const repo = options.repo || repositoryUrl?.replace(/\.git$/, "").replace(/^.*github\.com\//, "") || `OWNER/${name}`;
  if (!VALID_REPO.test(repo)) {
    fatal(`Invalid repository: ${repo}`, "Use format: owner/repo");
  }
  phase(`Generating Homebrew formula for ${fmt.app(name)}`);

  const desc = rubyStringLiteral(pkg.description || name);
  const homepage = rubyStringLiteral(`https://github.com/${repo}`);
  const tarballUrl = rubyStringLiteral(
    `https://registry.npmjs.org/${pkg.name}/-/${name}-${pkg.version}.tgz`,
  );
  const license = rubyStringLiteral(pkg.license || "MIT");

  const formula = `class ${className} < Formula
  desc ${desc}
  homepage ${homepage}
  url ${tarballUrl}
  license ${license}

  depends_on "node@24"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink libexec/"bin"/"${name}"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/${name} --version")
  end
end
`;

  const outPath = options.output || join(cwd, `${name}.rb`);
  writeFileSync(outPath, formula);
  success(`Homebrew formula saved to ${fmt.url(outPath)}`);

  return { path: outPath, className, name };
}
