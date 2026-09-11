import { execFileSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { phase, status, success, fatal, fmt, hint } from "@shipcli/core/output";

var VALID_ACCESS = new Set(["public", "restricted"]);

export function publish(options = {}) {
  var cwd = options.cwd || process.cwd();
  var pkgPath = join(cwd, "package.json");
  var pkg;

  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    fatal("No package.json found.", "Run this command from a CLI project root.");
  }

  var currentVersion = pkg.version;
  var bump = options.bump || "patch";
  var access = options.access || "public";

  if (!VALID_ACCESS.has(access)) {
    fatal(`Invalid access level: ${access}`, "Use 'public' or 'restricted'.");
  }

  phase(`Publishing ${fmt.app(pkg.name)}`);

  var newVersion = bumpVersion(currentVersion, bump);

  if (options.dryRun) {
    status(`Planned version: ${fmt.dim(currentVersion)} → ${fmt.val(newVersion)} (${bump})`);
    status(fmt.dim("Dry run — package.json, git history, and tags will not be changed"));
    execFileSync("npm", ["publish", "--dry-run", "--access", access], {
      cwd,
      stdio: "inherit",
    });
    return { name: pkg.name, version: newVersion, dryRun: true };
  }

  // Version bump
  var originalPackage = readFileSync(pkgPath, "utf-8");
  pkg.version = newVersion;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  status(`Version: ${fmt.dim(currentVersion)} → ${fmt.val(newVersion)} (${bump})`);

  // npm publish
  try {
    execFileSync("npm", ["publish", "--access", access], { cwd, stdio: "inherit" });
    success(`Published ${fmt.app(pkg.name)}@${fmt.val(newVersion)} to npm`);
  } catch {
    writeFileSync(pkgPath, originalPackage);
    fatal("npm publish failed.", "Check your npm auth: npm whoami");
  }

  // Create release history only after npm accepts the package.
  if (!options.skipGit) {
    try {
      execFileSync("git", ["add", "package.json"], { cwd, stdio: "pipe" });
      execFileSync("git", ["commit", "-m", `v${newVersion}`], { cwd, stdio: "pipe" });
      execFileSync("git", ["tag", `v${newVersion}`], { cwd, stdio: "pipe" });
      status(`Git tag: ${fmt.val("v" + newVersion)}`);
      hint("Next", `Push the tag: ${fmt.cmd(`git push && git push origin v${newVersion}`)}`);
    } catch {
      status(fmt.dim("Git commit or tag skipped; the npm package was published successfully"));
    }
  }

  return { name: pkg.name, version: newVersion };
}

export function bumpVersion(version, type) {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    throw new Error(`Unsupported version: ${version}. Use a stable semantic version (x.y.z).`);
  }
  if (!new Set(["major", "minor", "patch"]).has(type)) {
    throw new Error(`Unsupported bump type: ${type}. Use major, minor, or patch.`);
  }

  var parts = version.split(".").map(Number);
  if (type === "major") return `${parts[0] + 1}.0.0`;
  if (type === "minor") return `${parts[0]}.${parts[1] + 1}.0`;
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}
