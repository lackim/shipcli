#!/usr/bin/env node

import { createCLI } from "@shipcli/core/cli";
import { fatal } from "@shipcli/core/output";
import {
  loadShipcliConfig,
  type ShipcliProjectConfig,
} from "@shipcli/core/project-config";
import { publish } from "@shipcli/build/npm-publish";
import { build, selectTargets, type BuildOptions } from "@shipcli/build/binary";
import { generateFormula } from "@shipcli/build/homebrew";
import { generateChangelog } from "@shipcli/build/changelog";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInitArgs, type InitCommandOptions } from "./init.js";

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

async function readProjectConfig(): Promise<ShipcliProjectConfig> {
  try {
    return await loadShipcliConfig(process.cwd());
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    fatal("Could not load the shipcli project configuration.", detail);
  }
}

// --- Init (delegates to create-shipcli) ---
cli
  .command("init [name]")
  .description("Scaffold a new CLI tool (alias for npx @shipcli/create)")
  .option("-d, --description <text>", "Set the package description")
  .option("--no-git", "Skip git initialization")
  .option("--no-install", "Skip dependency installation")
  .action(async (
    name: string | undefined,
    options: InitCommandOptions,
  ) => {
    const { execFileSync } = await import("node:child_process");
    execFileSync("npx", createInitArgs(name, options), { stdio: "inherit" });
  });

// --- Publish ---
cli
  .command("publish")
  .description("Version bump, git tag, and npm publish")
  .option("--bump <type>", "Version bump type (major, minor, patch)")
  .option("--dry-run", "Run without actually publishing")
  .option("--skip-git", "Skip git commit and tag")
  .option("--access <type>", "npm access level (public, restricted)")
  .action(async (options: { bump?: "major" | "minor" | "patch"; dryRun?: boolean; skipGit?: boolean; access?: "public" | "restricted" }) => {
    const config = await readProjectConfig();
    publish({
      ...options,
      bump: options.bump ?? config.publish?.bump,
      access: options.access ?? config.publish?.access,
      cwd: process.cwd(),
    });
  });

// --- Build ---
cli
  .command("build")
  .description("Build cross-platform binaries with Bun")
  .option("--out-dir <dir>", "Output directory")
  .option("--entrypoint <path>", "TypeScript or JavaScript CLI entrypoint")
  .option("--targets <list>", "Comma-separated targets (macos-arm64,linux-x64,...)")
  .action(async (options: { outDir?: string; entrypoint?: string; targets?: string }) => {
    const config = await readProjectConfig();
    const configuredTargets = options.targets?.split(",") ?? config.build?.targets;
    const buildOpts: BuildOptions = {
      cwd: process.cwd(),
      outDir: options.outDir ?? config.build?.outDir,
      entrypoint: options.entrypoint ?? config.build?.entrypoint,
      targets: configuredTargets ? selectTargets(configuredTargets) : undefined,
    };
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
  .option("--out-dir <path>", "Output directory")
  .option("--force", "Overwrite files in an existing web directory")
  .action(async (options: { name?: string; description?: string; outDir?: string; force?: boolean }) => {
    const { scaffoldLanding } = await import("@shipcli/landing");
    const config = await readProjectConfig();
    scaffoldLanding({
      ...options,
      name: options.name ?? config.name,
      description: options.description ?? config.description,
      outDir: options.outDir ?? config.landing?.outDir,
      cwd: process.cwd(),
    });
  });

await cli.run();
