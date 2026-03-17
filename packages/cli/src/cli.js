#!/usr/bin/env node

import { createCLI } from "@shipcli/core/cli";
import { publish } from "@shipcli/build/npm-publish";
import { build } from "@shipcli/build/binary";
import { generateFormula } from "@shipcli/build/homebrew";
import { generateChangelog } from "@shipcli/build/changelog";

var cli = createCLI({
  name: "shipcli",
  description: "CLI-as-a-Product toolkit — build, publish, and promote CLI tools",
  version: "0.1.0",
  configDir: ".shipcli",
});

// --- Init (delegates to create-shipcli) ---
cli
  .command("init [name]")
  .description("Scaffold a new CLI tool (alias for npx create-shipcli)")
  .action(async (name) => {
    var { execSync } = await import("child_process");
    var args = name ? ` ${name}` : "";
    execSync(`npx create-shipcli${args}`, { stdio: "inherit" });
  });

// --- Publish ---
cli
  .command("publish")
  .description("Version bump, git tag, and npm publish")
  .option("--bump <type>", "Version bump type (major, minor, patch)", "patch")
  .option("--dry-run", "Run without actually publishing")
  .option("--skip-git", "Skip git commit and tag")
  .option("--access <type>", "npm access level (public, restricted)", "public")
  .action((options) => {
    publish({ ...options, cwd: process.cwd() });
  });

// --- Build ---
cli
  .command("build")
  .description("Build cross-platform binaries with Bun")
  .option("--out-dir <dir>", "Output directory", "dist")
  .option("--targets <list>", "Comma-separated targets (macos-arm64,linux-x64,...)")
  .action((options) => {
    var buildOpts = { cwd: process.cwd(), outDir: options.outDir };
    if (options.targets) {
      var TARGETS = [
        { name: "macos-arm64", bun: "bun-darwin-arm64", label: "macOS (Apple Silicon)" },
        { name: "macos-x64", bun: "bun-darwin-x64", label: "macOS (Intel)" },
        { name: "linux-x64", bun: "bun-linux-x64", label: "Linux (x64)" },
        { name: "linux-arm64", bun: "bun-linux-arm64", label: "Linux (ARM64)" },
        { name: "windows-x64", bun: "bun-windows-x64", label: "Windows (x64)" },
      ];
      var selected = options.targets.split(",");
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
  .action((options) => {
    generateFormula({ ...options, cwd: process.cwd() });
  });

// --- Changelog ---
cli
  .command("changelog")
  .description("Generate changelog from git commits")
  .action(() => {
    generateChangelog({ cwd: process.cwd() });
  });

cli.run();
