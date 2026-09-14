import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { Config } from "../packages/core/src/config.js";
import { defineConfig, loadShipcliConfig } from "../packages/core/src/project-config.js";

test("Config persists nested values with private file permissions", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "shipcli-config-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  const config = new Config("test-tool");
  config.dir = dir;
  config.path = join(dir, "config.json");

  config.set("output.format", "json").save();

  assert.equal(config.get("output.format"), "json");
  assert.deepEqual(JSON.parse(readFileSync(config.path, "utf-8")), {
    output: { format: "json" },
  });
  if (process.platform !== "win32") {
    assert.equal(statSync(config.path).mode & 0o777, 0o600);
  }
});

test("Config rejects prototype-pollution keys", () => {
  const config = new Config("test-tool");
  assert.throws(() => config.set("__proto__.polluted", true), /Invalid config key/);
  assert.throws(() => config.set("safe.constructor.value", true), /Invalid config key/);
});

test("project config loads a default export and defineConfig preserves its type", async (t) => {
  const cwd = mkdtempSync(join(tmpdir(), "shipcli-project-config-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));

  const input = defineConfig({
    build: { targets: ["linux-x64"] },
    share: { enabled: false },
  });
  assert.deepEqual(input.build?.targets, ["linux-x64"]);

  writeFileSync(
    join(cwd, "shipcli.config.mjs"),
    "export default { build: { outDir: 'bin' }, landing: { outDir: 'site' } };\n",
  );

  const loaded = await loadShipcliConfig(cwd);
  assert.equal(loaded.build?.outDir, "bin");
  assert.equal(loaded.landing?.outDir, "site");
});

test("project config returns an empty object when no config file exists", async (t) => {
  const cwd = mkdtempSync(join(tmpdir(), "shipcli-project-config-empty-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));

  assert.deepEqual(await loadShipcliConfig(cwd), {});
});
