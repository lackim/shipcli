import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { phase, status, success, fatal, fmt, hint } from "@shipcli/core/output";
import type { ExecFileRunner, PackageJson } from "./types.js";

const VALID_ACCESS = new Set(["public", "restricted"]);

export type BumpType = "major" | "minor" | "patch";
export type PackageAccess = "public" | "restricted";

export interface PublishOptions {
  cwd?: string;
  bump?: BumpType;
  access?: PackageAccess;
  dryRun?: boolean;
  skipGit?: boolean;
  execFile?: ExecFileRunner;
}

export interface PublishResult {
  name: string;
  version: string;
  dryRun?: true;
}

export function publish(options: PublishOptions = {}): PublishResult {
  const cwd = options.cwd || process.cwd();
  const run = options.execFile || (execFileSync as ExecFileRunner);
  const pkgPath = join(cwd, "package.json");
  let pkg: PackageJson;

  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    fatal("No package.json found.", "Run this command from a CLI project root.");
  }

  if (typeof pkg.name !== "string" || pkg.name.length === 0) {
    fatal("package.json does not contain a valid package name.");
  }
  if (typeof pkg.version !== "string" || pkg.version.length === 0) {
    fatal("package.json does not contain a valid package version.");
  }

  const currentVersion = pkg.version;
  const bump = options.bump || "patch";
  const access = options.access || "public";

  if (!VALID_ACCESS.has(access)) {
    fatal(`Invalid access level: ${access}`, "Use 'public' or 'restricted'.");
  }

  if (!options.dryRun && !options.skipGit) {
    try {
      const output = run("git", ["status", "--porcelain"], {
        cwd,
        encoding: "utf-8",
        stdio: "pipe",
      });
      const statusOutput = typeof output === "string"
        ? output
        : Buffer.isBuffer(output)
          ? output.toString("utf-8")
          : "";
      if (statusOutput.trim()) {
        fatal(
          "The git working tree is not clean.",
          "Commit or stash your changes before publishing, or use --skip-git intentionally.",
        );
      }
    } catch (cause) {
      if (cause instanceof Error && cause.message === "The git working tree is not clean.") throw cause;
      fatal(
        "Could not verify the git working tree.",
        "Run from a git repository or use --skip-git intentionally.",
      );
    }
  }

  phase(`Publishing ${fmt.app(pkg.name)}`);

  const newVersion = bumpVersion(currentVersion, bump);

  if (options.dryRun) {
    status(`Planned version: ${fmt.dim(currentVersion)} → ${fmt.val(newVersion)} (${bump})`);
    status(fmt.dim("Dry run — package.json, git history, and tags will not be changed"));
    run("npm", ["publish", "--dry-run", "--access", access], {
      cwd,
      stdio: "inherit",
    });
    return { name: pkg.name, version: newVersion, dryRun: true };
  }

  // Version bump
  const originalPackage = readFileSync(pkgPath, "utf-8");
  pkg.version = newVersion;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  status(`Version: ${fmt.dim(currentVersion)} → ${fmt.val(newVersion)} (${bump})`);

  // npm publish
  try {
    run("npm", ["publish", "--access", access], { cwd, stdio: "inherit" });
    success(`Published ${fmt.app(pkg.name)}@${fmt.val(newVersion)} to npm`);
  } catch {
    writeFileSync(pkgPath, originalPackage);
    fatal("npm publish failed.", "Check your npm auth: npm whoami");
  }

  // Create release history only after npm accepts the package.
  if (!options.skipGit) {
    try {
      run("git", ["add", "package.json"], { cwd, stdio: "pipe" });
      run("git", ["commit", "-m", `v${newVersion}`], { cwd, stdio: "pipe" });
      run("git", ["tag", `v${newVersion}`], { cwd, stdio: "pipe" });
      status(`Git tag: ${fmt.val("v" + newVersion)}`);
      hint("Next", `Push the tag: ${fmt.cmd(`git push && git push origin v${newVersion}`)}`);
    } catch {
      status(fmt.dim("Git commit or tag skipped; the npm package was published successfully"));
    }
  }

  return { name: pkg.name, version: newVersion };
}

export function bumpVersion(version: string, type: string): string {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    throw new Error(`Unsupported version: ${version}. Use a stable semantic version (x.y.z).`);
  }
  if (!new Set(["major", "minor", "patch"]).has(type)) {
    throw new Error(`Unsupported bump type: ${type}. Use major, minor, or patch.`);
  }

  const parts = version.split(".").map(Number);
  if (type === "major") return `${parts[0] + 1}.0.0`;
  if (type === "minor") return `${parts[0]}.${parts[1] + 1}.0`;
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}
