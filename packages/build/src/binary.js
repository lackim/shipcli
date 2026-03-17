import { execSync } from "child_process";
import { readFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { phase, status, success, fatal, fmt } from "@shipcli/core/output";
import { spinner } from "@shipcli/core/spinner";

var TARGETS = [
  { name: "macos-arm64", bun: "bun-darwin-arm64", label: "macOS (Apple Silicon)" },
  { name: "macos-x64", bun: "bun-darwin-x64", label: "macOS (Intel)" },
  { name: "linux-x64", bun: "bun-linux-x64", label: "Linux (x64)" },
  { name: "linux-arm64", bun: "bun-linux-arm64", label: "Linux (ARM64)" },
  { name: "windows-x64", bun: "bun-windows-x64", label: "Windows (x64)" },
];

export function build(options = {}) {
  var cwd = options.cwd || process.cwd();
  var pkgPath = join(cwd, "package.json");
  var pkg;

  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    fatal("No package.json found.", "Run this command from a CLI project root.");
  }

  var entrypoint = pkg.bin?.[pkg.name] || pkg.bin?.[Object.keys(pkg.bin)[0]] || "./src/cli.js";
  var outDir = join(cwd, options.outDir || "dist");
  var targets = options.targets || TARGETS;

  phase(`Building binaries for ${fmt.app(pkg.name)}`);

  // Check bun is available
  try {
    execSync("bun --version", { stdio: "pipe" });
  } catch {
    fatal("Bun is required for binary builds.", `Install it: ${fmt.cmd("curl -fsSL https://bun.sh/install | bash")}`);
  }

  mkdirSync(outDir, { recursive: true });

  var built = [];
  for (var target of targets) {
    var outName = `${pkg.name}-${target.name}${target.name.includes("windows") ? ".exe" : ""}`;
    var outPath = join(outDir, outName);

    var s = spinner(`Building ${target.label}...`).start();
    try {
      execSync(
        `bun build ${entrypoint} --compile --target=${target.bun} --outfile ${outPath}`,
        { cwd, stdio: "pipe" }
      );
      s.success({ text: `${target.label} → ${fmt.dim(outName)}` });
      built.push({ target: target.name, path: outPath, name: outName });
    } catch (err) {
      s.error({ text: `${target.label} — failed` });
    }
  }

  if (built.length > 0) {
    success(`${built.length} binaries built in ${fmt.url(outDir)}`);
  } else {
    fatal("No binaries were built successfully.");
  }

  return built;
}
