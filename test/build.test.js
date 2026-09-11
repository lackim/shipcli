import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { build } from "../packages/build/src/binary.js";
import { generateChangelog } from "../packages/build/src/changelog.js";
import { generateFormula } from "../packages/build/src/homebrew.js";
import { bumpVersion, publish } from "../packages/build/src/npm-publish.js";

function createProject(t, pkg = {}) {
  var cwd = mkdtempSync(join(tmpdir(), "shipcli-build-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  writeFileSync(
    join(cwd, "package.json"),
    JSON.stringify({
      name: "demo-cli",
      version: "1.2.3",
      description: "Demo CLI",
      license: "MIT",
      bin: { "demo-cli": "./src/cli.js" },
      repository: { url: "https://github.com/example/demo-cli.git" },
      ...pkg,
    }, null, 2) + "\n"
  );
  return cwd;
}

test("bumpVersion increments stable semantic versions", () => {
  assert.equal(bumpVersion("1.2.3", "patch"), "1.2.4");
  assert.equal(bumpVersion("1.2.3", "minor"), "1.3.0");
  assert.equal(bumpVersion("1.2.3", "major"), "2.0.0");
});

test("bumpVersion rejects invalid inputs", () => {
  assert.throws(() => bumpVersion("1.2", "patch"), /semantic version/);
  assert.throws(() => bumpVersion("1.2.3", "banana"), /bump type/);
});

test("publish dry run leaves package.json and git untouched", (t) => {
  var cwd = createProject(t);
  var before = readFileSync(join(cwd, "package.json"), "utf-8");
  var calls = [];

  var result = publish({
    cwd,
    dryRun: true,
    bump: "minor",
    execFile(command, args) {
      calls.push([command, args]);
    },
  });

  assert.deepEqual(result, { name: "demo-cli", version: "1.3.0", dryRun: true });
  assert.equal(readFileSync(join(cwd, "package.json"), "utf-8"), before);
  assert.deepEqual(calls, [["npm", ["publish", "--dry-run", "--access", "public"]]]);
});

test("build invokes Bun with the requested target", (t) => {
  var cwd = createProject(t);
  var calls = [];
  var targets = [{ name: "linux-x64", bun: "bun-linux-x64", label: "Linux (x64)" }];

  var result = build({
    cwd,
    targets,
    execFile(command, args) {
      calls.push([command, args]);
    },
  });

  assert.equal(result.length, 1);
  assert.deepEqual(calls[0], ["bun", ["--version"]]);
  assert.equal(calls[1][0], "bun");
  assert.deepEqual(calls[1][1].slice(0, 4), ["build", "./src/cli.js", "--compile", "--target=bun-linux-x64"]);
});

test("generateFormula uses repository metadata", (t) => {
  var cwd = createProject(t);
  var { path } = generateFormula({ cwd });
  var formula = readFileSync(path, "utf-8");

  assert.match(formula, /class DemoCli < Formula/);
  assert.match(formula, /homepage "https:\/\/github.com\/example\/demo-cli"/);
  assert.match(formula, /license "MIT"/);
});

test("generateChangelog groups conventional commits", (t) => {
  var cwd = createProject(t);
  execFileSync("git", ["init"], { cwd, stdio: "ignore" });
  execFileSync("git", ["config", "user.name", "shipcli test"], { cwd });
  execFileSync("git", ["config", "user.email", "test@example.com"], { cwd });
  execFileSync("git", ["add", "package.json"], { cwd });
  execFileSync("git", ["commit", "-m", "feat: initial command"], { cwd, stdio: "ignore" });
  writeFileSync(join(cwd, "fix.txt"), "fixed\n");
  execFileSync("git", ["add", "fix.txt"], { cwd });
  execFileSync("git", ["commit", "-m", "fix: correct output"], { cwd, stdio: "ignore" });

  var result = generateChangelog({ cwd });
  var changelog = readFileSync(join(cwd, "CHANGELOG.md"), "utf-8");

  assert.equal(result.features, 1);
  assert.equal(result.fixes, 1);
  assert.match(changelog, /### Features/);
  assert.match(changelog, /### Fixes/);
});
