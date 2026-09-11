import assert from "node:assert/strict";
import test from "node:test";

import { bumpVersion } from "../packages/build/src/npm-publish.js";

test("bumpVersion increments stable semantic versions", () => {
  assert.equal(bumpVersion("1.2.3", "patch"), "1.2.4");
  assert.equal(bumpVersion("1.2.3", "minor"), "1.3.0");
  assert.equal(bumpVersion("1.2.3", "major"), "2.0.0");
});

test("bumpVersion rejects invalid inputs", () => {
  assert.throws(() => bumpVersion("1.2", "patch"), /semantic version/);
  assert.throws(() => bumpVersion("1.2.3", "banana"), /bump type/);
});
