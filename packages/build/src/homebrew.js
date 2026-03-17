import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { phase, success, fatal, fmt } from "@shipcli/core/output";

export function generateFormula(options = {}) {
  var cwd = options.cwd || process.cwd();
  var pkgPath = join(cwd, "package.json");
  var pkg;

  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    fatal("No package.json found.", "Run this command from a CLI project root.");
  }

  var name = pkg.name.replace(/^@[^/]+\//, ""); // strip scope
  var className = name
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  var repo = options.repo || pkg.repository?.url?.replace(/\.git$/, "").replace(/^.*github\.com\//, "") || `OWNER/${name}`;
  var version = options.version || pkg.version;

  phase(`Generating Homebrew formula for ${fmt.app(name)}`);

  var formula = `class ${className} < Formula
  desc "${pkg.description || name}"
  homepage "https://github.com/${repo}"
  url "https://registry.npmjs.org/${pkg.name}/-/${name}-#{version}.tgz"
  license "${pkg.license || "MIT"}"

  depends_on "node@20"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink libexec/"bin"/"${name}"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/${name} --version")
  end
end
`;

  var outPath = options.output || join(cwd, `${name}.rb`);
  writeFileSync(outPath, formula);
  success(`Homebrew formula saved to ${fmt.url(outPath)}`);

  return { path: outPath, className, name };
}
