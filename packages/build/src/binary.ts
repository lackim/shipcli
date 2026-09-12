import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { phase, success, fatal, fmt } from "@shipcli/core/output";
import { spinner } from "@shipcli/core/spinner";
import type { ExecFileRunner, PackageJson } from "./types.js";

export interface BinaryTarget {
  name: string;
  bun: string;
  label: string;
}

export interface BuildOptions {
  cwd?: string;
  entrypoint?: string;
  outDir?: string;
  targets?: readonly BinaryTarget[];
  execFile?: ExecFileRunner;
}

export interface BuiltBinary {
  target: string;
  path: string;
  name: string;
}

export const TARGETS: readonly BinaryTarget[] = [
  { name: "macos-arm64", bun: "bun-darwin-arm64", label: "macOS (Apple Silicon)" },
  { name: "macos-x64", bun: "bun-darwin-x64", label: "macOS (Intel)" },
  { name: "linux-x64", bun: "bun-linux-x64", label: "Linux (x64)" },
  { name: "linux-arm64", bun: "bun-linux-arm64", label: "Linux (ARM64)" },
  { name: "windows-x64", bun: "bun-windows-x64", label: "Windows (x64)" },
];

export function build(options: BuildOptions = {}): BuiltBinary[] {
  const cwd = options.cwd || process.cwd();
  const run = options.execFile || (execFileSync as ExecFileRunner);
  const pkgPath = join(cwd, "package.json");
  let pkg: PackageJson;

  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    fatal("No package.json found.", "Run this command from a CLI project root.");
  }

  const packageBin = typeof pkg.bin === "string"
    ? pkg.bin
    : pkg.bin?.[pkg.name] || (pkg.bin ? Object.values(pkg.bin)[0] : undefined);
  const entrypoint = options.entrypoint || pkg.shipcli?.entrypoint || packageBin || "./src/cli.ts";
  const outDir = join(cwd, options.outDir || "dist");
  const targets = options.targets || TARGETS;

  phase(`Building binaries for ${fmt.app(pkg.name)}`);

  // Check bun is available
  try {
    run("bun", ["--version"], { stdio: "pipe" });
  } catch {
    fatal("Bun is required for binary builds.", `Install it: ${fmt.cmd("curl -fsSL https://bun.sh/install | bash")}`);
  }

  mkdirSync(outDir, { recursive: true });

  const built: BuiltBinary[] = [];
  for (const target of targets) {
    const outName = `${pkg.name}-${target.name}${target.name.includes("windows") ? ".exe" : ""}`;
    const outPath = join(outDir, outName);

    const s = spinner(`Building ${target.label}...`).start();
    try {
      run(
        "bun",
        ["build", entrypoint, "--compile", `--target=${target.bun}`, "--outfile", outPath],
        { cwd, stdio: "pipe" }
      );
      s.success({ text: `${target.label} → ${fmt.dim(outName)}` });
      built.push({ target: target.name, path: outPath, name: outName });
    } catch {
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
