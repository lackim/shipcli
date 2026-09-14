import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import type { TestContext } from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { createInitArgs } from "../packages/cli/src/init.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);
const tscCli = require.resolve("typescript/bin/tsc");
const createVersion = JSON.parse(
  readFileSync(join(repoRoot, "packages/create-cli/package.json"), "utf-8"),
).version as string;
const cliVersion = JSON.parse(
  readFileSync(join(repoRoot, "packages/cli/package.json"), "utf-8"),
).version as string;

test("shipcli reports the package version", () => {
  const result = spawnSync(process.execPath, ["packages/cli/dist/cli.js", "--version"], {
    cwd: repoRoot,
    encoding: "utf-8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), cliVersion);
});

test("shipcli init forwards generator options", () => {
  assert.deepEqual(
    createInitArgs("demo-cli", {
      description: "Demo CLI",
      git: false,
      install: false,
    }),
    ["@shipcli/create", "demo-cli", "--description", "Demo CLI", "--no-git", "--no-install"],
  );
});

test("create package scaffolds a valid project without overwriting files", (t: TestContext) => {
  const cwd = mkdtempSync(join(tmpdir(), "shipcli-create-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));

  const script = join(repoRoot, "packages/create-cli/dist/index.js");
  const first = spawnSync(
    process.execPath,
    [
      script,
      "demo-cli",
      "--description",
      'A "quoted" description',
      "--no-install",
      "--no-git",
    ],
    {
      cwd,
      encoding: "utf-8",
    }
  );

  assert.equal(first.status, 0, first.stderr);
  const generated = JSON.parse(readFileSync(join(cwd, "demo-cli/package.json"), "utf-8"));
  assert.equal(generated.description, 'A "quoted" description');
  assert.equal(generated.scripts.start, "tsx src/cli.ts");
  assert.equal(generated.dependencies["@shipcli/share"], `^${createVersion}`);

  assert.equal(existsSync(join(cwd, "demo-cli/src/share-card.ts")), true);
  assert.equal(existsSync(join(cwd, "demo-cli/shipcli.config.ts")), true);
  assert.equal(existsSync(join(cwd, "demo-cli/shipcli.config.js")), false);
  assert.equal(existsSync(join(cwd, "demo-cli/tsconfig.json")), true);
  assert.equal(existsSync(join(cwd, "demo-cli/tsconfig.build.json")), true);

  const second = spawnSync(process.execPath, [script, "demo-cli"], {
    cwd,
    encoding: "utf-8",
  });
  assert.notEqual(second.status, 0);
  assert.match(second.stderr, /destination directory is not empty/);
});

test("generated CLI runs and creates a share image", (t: TestContext) => {
  const cwd = mkdtempSync(join(tmpdir(), "shipcli-e2e-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));

  const createScript = join(repoRoot, "packages/create-cli/dist/index.js");
  const generated = spawnSync(
    process.execPath,
    [createScript, "demo-cli", "--no-install", "--no-git"],
    { cwd, encoding: "utf-8" }
  );
  assert.equal(generated.status, 0, generated.stderr);

  const project = join(cwd, "demo-cli");
  const scopeDir = join(project, "node_modules/@shipcli");
  mkdirSync(scopeDir, { recursive: true });
  const linkType: "junction" | "dir" = process.platform === "win32" ? "junction" : "dir";
  symlinkSync(join(repoRoot, "packages/core"), join(scopeDir, "core"), linkType);
  symlinkSync(join(repoRoot, "packages/share"), join(scopeDir, "share"), linkType);

  const typesDir = join(project, "node_modules/@types");
  mkdirSync(typesDir, { recursive: true });
  symlinkSync(join(repoRoot, "node_modules/@types/node"), join(typesDir, "node"), linkType);

  const typecheck = spawnSync(process.execPath, [tscCli, "-p", "tsconfig.json"], {
    cwd: project,
    encoding: "utf-8",
  });
  assert.equal(typecheck.status, 0, typecheck.stderr);

  const compile = spawnSync(process.execPath, [tscCli, "-p", "tsconfig.build.json"], {
    cwd: project,
    encoding: "utf-8",
  });
  assert.equal(compile.status, 0, compile.stderr);

  const run = spawnSync(
    process.execPath,
    ["dist/cli.js", "example", "--share", "--json"],
    {
      cwd: project,
      encoding: "utf-8",
      env: { ...process.env, SHIPCLI_DISABLE_UPDATE_CHECK: "1" },
    }
  );

  assert.equal(run.status, 0, run.stderr);
  const output = JSON.parse(run.stdout);
  assert.equal(output.target, "example");
  assert.equal(output.status, "ok");
  assert.equal(basename(output.shareImage), "demo-cli-result.png");
  assert.equal(existsSync(output.shareImage), true);

  const configPath = join(project, "shipcli.config.ts");
  const config = readFileSync(configPath, "utf-8").replace("enabled: true", "enabled: false");
  writeFileSync(configPath, config);
  const disabledShare = spawnSync(
    process.execPath,
    ["dist/cli.js", "example", "--share", "--json"],
    {
      cwd: project,
      encoding: "utf-8",
      env: { ...process.env, SHIPCLI_DISABLE_UPDATE_CHECK: "1" },
    },
  );
  assert.equal(disabledShare.status, 0, disabledShare.stderr);
  assert.equal("shareImage" in JSON.parse(disabledShare.stdout), false);
});
