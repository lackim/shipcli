import { execFileSync } from "node:child_process";
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { phase, success, fatal, fmt } from "@shipcli/core/output";

export interface ChangelogOptions {
  cwd?: string;
}

export interface ChangelogResult {
  version: string;
  date: string;
  features: number;
  fixes: number;
  other: number;
}

interface Commit {
  hash: string;
  msg: string;
}

export function generateChangelog(options: ChangelogOptions = {}): ChangelogResult | null {
  const cwd = options.cwd || process.cwd();

  phase("Generating changelog");

  // Get the last tag
  let lastTag;
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
  const range = lastTag ? `${lastTag}..HEAD` : "HEAD";
  let log;
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

  const commits: Commit[] = log.split("\n").map((line) => {
    const [hash, ...rest] = line.split(" ");
    const msg = rest.join(" ");
    return { hash, msg };
  });

  // Categorize
  const features: Commit[] = [];
  const fixes: Commit[] = [];
  const other: Commit[] = [];

  for (const c of commits) {
    const lower = c.msg.toLowerCase();
    if (lower.startsWith("feat") || lower.startsWith("add")) {
      features.push(c);
    } else if (lower.startsWith("fix")) {
      fixes.push(c);
    } else {
      other.push(c);
    }
  }

  // Get current version
  let version;
  try {
    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf-8"));
    version = pkg.version;
  } catch {
    version = "Unreleased";
  }

  const date = new Date().toISOString().split("T")[0];
  const lines = [`## ${version} (${date})`, ""];

  if (features.length > 0) {
    lines.push("### Features", "");
    for (const feature of features) lines.push(`- ${feature.msg} (${feature.hash})`);
    lines.push("");
  }

  if (fixes.length > 0) {
    lines.push("### Fixes", "");
    for (const fix of fixes) lines.push(`- ${fix.msg} (${fix.hash})`);
    lines.push("");
  }

  if (other.length > 0) {
    lines.push("### Other", "");
    for (const o of other) lines.push(`- ${o.msg} (${o.hash})`);
    lines.push("");
  }

  const entry = lines.join("\n");

  // Prepend to CHANGELOG.md
  const changelogPath = join(cwd, "CHANGELOG.md");
  const existing = existsSync(changelogPath) ? readFileSync(changelogPath, "utf-8") : "# Changelog\n\n";
  const header = existing.split("\n").slice(0, 2).join("\n");
  const rest = existing.split("\n").slice(2).join("\n");
  writeFileSync(changelogPath, `${header}\n${entry}\n${rest}`);

  success(`Changelog updated: ${fmt.url(changelogPath)}`);
  return { version, date, features: features.length, fixes: fixes.length, other: other.length };
}
