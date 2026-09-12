#!/usr/bin/env node

import { createCLI } from "@shipcli/core/cli";
import { publish } from "@shipcli/build/npm-publish";
import { build, TARGETS, type BuildOptions } from "@shipcli/build/binary";
import { generateFormula } from "@shipcli/build/homebrew";
import { generateChangelog } from "@shipcli/build/changelog";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8")) as {
  name: string;
  version: string;
};

const cli = createCLI({
  name: "shipcli",
  description: "CLI-as-a-Product toolkit — build, publish, and promote CLI tools",
  version: pkg.version,
  packageName: pkg.name,
});

// --- Init (delegates to create-shipcli) ---
cli
  .command("init [name]")
  .description("Scaffold a new CLI tool (alias for npx @shipcli/create)")
  .action(async (name: string | undefined) => {
    const { execFileSync } = await import("node:child_process");
    const args = ["@shipcli/create"];
    if (name) args.push(name);
    execFileSync("npx", args, { stdio: "inherit" });
  });

// --- Publish ---
cli
  .command("publish")
  .description("Version bump, git tag, and npm publish")
  .option("--bump <type>", "Version bump type (major, minor, patch)", "patch")
  .option("--dry-run", "Run without actually publishing")
  .option("--skip-git", "Skip git commit and tag")
  .option("--access <type>", "npm access level (public, restricted)", "public")
  .action((options: { bump: "major" | "minor" | "patch"; dryRun?: boolean; skipGit?: boolean; access: "public" | "restricted" }) => {
    publish({ ...options, cwd: process.cwd() });
  });

// --- Build ---
cli
  .command("build")
  .description("Build cross-platform binaries with Bun")
  .option("--out-dir <dir>", "Output directory", "dist")
  .option("--entrypoint <path>", "TypeScript or JavaScript CLI entrypoint")
  .option("--targets <list>", "Comma-separated targets (macos-arm64,linux-x64,...)")
  .action((options: { outDir: string; entrypoint?: string; targets?: string }) => {
    const buildOpts: BuildOptions = {
      cwd: process.cwd(),
      outDir: options.outDir,
      entrypoint: options.entrypoint,
    };
    if (options.targets) {
      const selected = options.targets.split(",");
      buildOpts.targets = TARGETS.filter((t) => selected.includes(t.name));
    }
    build(buildOpts);
  });

// --- Homebrew ---
cli
  .command("homebrew")
  .description("Generate a Homebrew formula")
  .option("--repo <owner/repo>", "GitHub repository")
  .option("--output <path>", "Output file path")
  .action((options: { repo?: string; output?: string }) => {
    generateFormula({ ...options, cwd: process.cwd() });
  });

// --- Changelog ---
cli
  .command("changelog")
  .description("Generate changelog from git commits")
  .action(() => {
    generateChangelog({ cwd: process.cwd() });
  });

// --- Landing ---
const landingCmd = cli.command("landing").description("Manage landing page");

landingCmd
  .command("init")
  .description("Scaffold a Next.js landing page for your CLI tool")
  .option("--name <name>", "Tool name (auto-detected from package.json)")
  .option("--description <desc>", "Tool description")
  .option("--force", "Overwrite files in an existing web directory")
  .action(async (options: { name?: string; description?: string; force?: boolean }) => {
    const { scaffoldLanding } = await import("@shipcli/landing");
    scaffoldLanding({ ...options, cwd: process.cwd() });
  });

cli.run();
