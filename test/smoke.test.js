import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

var repoRoot = new URL("..", import.meta.url).pathname;

test("shipcli reports the package version", () => {
  var result = spawnSync(process.execPath, ["packages/cli/src/cli.js", "--version"], {
    cwd: repoRoot,
    encoding: "utf-8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "0.1.2");
});

test("create package scaffolds a valid project without overwriting files", (t) => {
  var cwd = mkdtempSync(join(tmpdir(), "shipcli-create-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));

  var script = join(repoRoot, "packages/create-cli/src/index.js");
  var first = spawnSync(process.execPath, [script, "demo-cli", 'A "quoted" description'], {
    cwd,
    encoding: "utf-8",
  });

  assert.equal(first.status, 0, first.stderr);
  var generated = JSON.parse(readFileSync(join(cwd, "demo-cli/package.json"), "utf-8"));
  assert.equal(generated.description, 'A "quoted" description');
  assert.equal(generated.scripts.start, "node src/cli.js");

  var second = spawnSync(process.execPath, [script, "demo-cli"], {
    cwd,
    encoding: "utf-8",
  });
  assert.notEqual(second.status, 0);
  assert.match(second.stderr, /destination directory is not empty/);
});
