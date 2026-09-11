import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { Config } from "../packages/core/src/config.js";

test("Config persists nested values with private file permissions", (t) => {
  var dir = mkdtempSync(join(tmpdir(), "shipcli-config-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  var config = new Config("test-tool");
  config.dir = dir;
  config.path = join(dir, "config.json");

  config.set("output.format", "json").save();

  assert.equal(config.get("output.format"), "json");
  assert.deepEqual(JSON.parse(readFileSync(config.path, "utf-8")), {
    output: { format: "json" },
  });
  assert.equal(statSync(config.path).mode & 0o777, 0o600);
});

test("Config rejects prototype-pollution keys", () => {
  var config = new Config("test-tool");
  assert.throws(() => config.set("__proto__.polluted", true), /Invalid config key/);
  assert.throws(() => config.set("safe.constructor.value", true), /Invalid config key/);
});
