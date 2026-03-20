import { execFileSync } from "child_process";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { phase, success, fatal, fmt } from "@shipcli/core/output";

export function generateChangelog(options = {}) {
  var cwd = options.cwd || process.cwd();

  phase("Generating changelog");

  // Get the last tag
  var lastTag;
  try {
    lastTag = execFileSync("git", ["describe", "--tags", "--abbrev=0", "HEAD~1"], {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
  } catch {
    lastTag = null;
  }

  // Get commits since last tag (or all commits)
  var range = lastTag ? `${lastTag}..HEAD` : "HEAD";
  var log;
  try {
    log = execFileSync("git", ["log", range, "--pretty=format:%h %s", "--no-merges"], {
      cwd,
      encoding: "utf-8",
    }).trim();
  } catch {
    fatal("Failed to read git log.", "Make sure you're in a git repository.");
  }

  if (!log) {
    success("No new commits since last tag.");
    return null;
  }

  var commits = log.split("\n").map((line) => {
    var [hash, ...rest] = line.split(" ");
    var msg = rest.join(" ");
    return { hash, msg };
  });

  // Categorize
  var features = [];
  var fixes = [];
  var other = [];

  for (var c of commits) {
    var lower = c.msg.toLowerCase();
    if (lower.startsWith("feat") || lower.startsWith("add")) {
      features.push(c);
    } else if (lower.startsWith("fix")) {
      fixes.push(c);
    } else {
      other.push(c);
    }
  }

  // Get current version
  var version;
  try {
    var pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf-8"));
    version = pkg.version;
  } catch {
    version = "Unreleased";
  }

  var date = new Date().toISOString().split("T")[0];
  var lines = [`## ${version} (${date})`, ""];

  if (features.length > 0) {
    lines.push("### Features", "");
    for (var f of features) lines.push(`- ${f.msg} (${f.hash})`);
    lines.push("");
  }

  if (fixes.length > 0) {
    lines.push("### Fixes", "");
    for (var f of fixes) lines.push(`- ${f.msg} (${f.hash})`);
    lines.push("");
  }

  if (other.length > 0) {
    lines.push("### Other", "");
    for (var o of other) lines.push(`- ${o.msg} (${o.hash})`);
    lines.push("");
  }

  var entry = lines.join("\n");

  // Prepend to CHANGELOG.md
  var changelogPath = join(cwd, "CHANGELOG.md");
  var existing = existsSync(changelogPath) ? readFileSync(changelogPath, "utf-8") : "# Changelog\n\n";
  var header = existing.split("\n").slice(0, 2).join("\n");
  var rest = existing.split("\n").slice(2).join("\n");
  writeFileSync(changelogPath, `${header}\n${entry}\n${rest}`);

  success(`Changelog updated: ${fmt.url(changelogPath)}`);
  return { version, date, features: features.length, fixes: fixes.length, other: other.length };
}
