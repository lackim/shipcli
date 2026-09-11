import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

var repoRoot = new URL("..", import.meta.url).pathname;

test("shipcli reports the package version", () => {
  var result = spawnSync(process.execPath, ["packages/cli/src/cli.js", "--version"], {
    cwd: repoRoot,
    encoding: "utf-8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "0.2.0");
});

test("create package scaffolds a valid project without overwriting files", (t) => {
  var cwd = mkdtempSync(join(tmpdir(), "shipcli-create-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));

  var script = join(repoRoot, "packages/create-cli/src/index.js");
  var first = spawnSync(
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
  var generated = JSON.parse(readFileSync(join(cwd, "demo-cli/package.json"), "utf-8"));
  assert.equal(generated.description, 'A "quoted" description');
  assert.equal(generated.scripts.start, "node src/cli.js");
  assert.equal(generated.dependencies["@shipcli/share"], "^0.2.0");

  var syntax = spawnSync(process.execPath, ["--check", join(cwd, "demo-cli/src/share-card.js")], {
    encoding: "utf-8",
  });
  assert.equal(syntax.status, 0, syntax.stderr);

  var second = spawnSync(process.execPath, [script, "demo-cli"], {
    cwd,
    encoding: "utf-8",
  });
  assert.notEqual(second.status, 0);
  assert.match(second.stderr, /destination directory is not empty/);
});

test("generated CLI runs and creates a share image", (t) => {
  var cwd = mkdtempSync(join(tmpdir(), "shipcli-e2e-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));

  var createScript = join(repoRoot, "packages/create-cli/src/index.js");
  var generated = spawnSync(
    process.execPath,
    [createScript, "demo-cli", "--no-install", "--no-git"],
    { cwd, encoding: "utf-8" }
  );
  assert.equal(generated.status, 0, generated.stderr);

  var project = join(cwd, "demo-cli");
  var scopeDir = join(project, "node_modules/@shipcli");
  mkdirSync(scopeDir, { recursive: true });
  var linkType = process.platform === "win32" ? "junction" : "dir";
  symlinkSync(join(repoRoot, "packages/core"), join(scopeDir, "core"), linkType);
  symlinkSync(join(repoRoot, "packages/share"), join(scopeDir, "share"), linkType);

  var run = spawnSync(
    process.execPath,
    ["src/cli.js", "example", "--share", "--json"],
    {
      cwd: project,
      encoding: "utf-8",
      env: { ...process.env, SHIPCLI_DISABLE_UPDATE_CHECK: "1" },
    }
  );

  assert.equal(run.status, 0, run.stderr);
  var output = JSON.parse(run.stdout);
  assert.equal(output.target, "example");
  assert.equal(output.status, "ok");
  assert.equal(basename(output.shareImage), "demo-cli-result.png");
  assert.equal(existsSync(output.shareImage), true);
});
