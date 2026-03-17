import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { phase, status, success, fatal, fmt, hint } from "@shipcli/core/output";

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

  phase(`Publishing ${fmt.app(pkg.name)}`);

  // Version bump
  var newVersion = bumpVersion(currentVersion, bump);
  pkg.version = newVersion;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  status(`Version: ${fmt.dim(currentVersion)} → ${fmt.val(newVersion)} (${bump})`);

  // Git tag
  if (!options.skipGit) {
    try {
      execSync(`git add package.json`, { cwd, stdio: "pipe" });
      execSync(`git commit -m "v${newVersion}"`, { cwd, stdio: "pipe" });
      execSync(`git tag v${newVersion}`, { cwd, stdio: "pipe" });
      status(`Git tag: ${fmt.val("v" + newVersion)}`);
    } catch (err) {
      status(fmt.dim("Git tag skipped (not a git repo or no changes)"));
    }
  }

  // npm publish
  if (options.dryRun) {
    status(fmt.dim("Dry run — skipping npm publish"));
    execSync(`npm publish --dry-run`, { cwd, stdio: "inherit" });
  } else {
    var access = options.access || "public";
    try {
      execSync(`npm publish --access ${access}`, { cwd, stdio: "inherit" });
      success(`Published ${fmt.app(pkg.name)}@${fmt.val(newVersion)} to npm`);
    } catch {
      fatal("npm publish failed.", "Check your npm auth: npm whoami");
    }
  }

  if (!options.skipGit) {
    hint("Next", `Push the tag: ${fmt.cmd(`git push && git push origin v${newVersion}`)}`);
  }

  return { name: pkg.name, version: newVersion };
}

function bumpVersion(version, type) {
  var parts = version.split(".").map(Number);
  if (type === "major") return `${parts[0] + 1}.0.0`;
  if (type === "minor") return `${parts[0]}.${parts[1] + 1}.0`;
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}
