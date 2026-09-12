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

function escapeRubyString(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const VALID_REPO = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;

export function generateFormula(options: FormulaOptions = {}): FormulaResult {
  const cwd = options.cwd || process.cwd();
  const pkgPath = join(cwd, "package.json");
  let pkg: PackageJson;

  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    fatal("No package.json found.", "Run this command from a CLI project root.");
  }

  const name = pkg.name.replace(/^@[^/]+\//, ""); // strip scope
  const className = name
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  const repositoryUrl = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
  const repo = options.repo || repositoryUrl?.replace(/\.git$/, "").replace(/^.*github\.com\//, "") || `OWNER/${name}`;
  if (!VALID_REPO.test(repo)) {
    fatal(`Invalid repository: ${repo}`, "Use format: owner/repo");
  }
  phase(`Generating Homebrew formula for ${fmt.app(name)}`);

  const desc = escapeRubyString(pkg.description || name);
  const license = escapeRubyString(pkg.license || "MIT");

  const formula = `class ${className} < Formula
  desc "${desc}"
  homepage "https://github.com/${repo}"
  url "https://registry.npmjs.org/${pkg.name}/-/${name}-#{version}.tgz"
  license "${license}"

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
