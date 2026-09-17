import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isNewerVersion } from "../packages/core/src/update-check.js";

describe("isNewerVersion", () => {
  it("does not suggest a downgrade", () => {
    assert.equal(isNewerVersion("0.2.0", "0.1.1"), false);
  });

  it("does not suggest the installed version", () => {
    assert.equal(isNewerVersion("1.2.3", "1.2.3"), false);
    assert.equal(isNewerVersion("1.2.3+local", "1.2.3+registry"), false);
  });

  it("recognizes newer patch, minor, and major versions", () => {
    assert.equal(isNewerVersion("1.2.3", "1.2.4"), true);
    assert.equal(isNewerVersion("1.2.3", "1.3.0"), true);
    assert.equal(isNewerVersion("1.2.3", "2.0.0"), true);
  });

  it("compares prerelease versions using SemVer precedence", () => {
    assert.equal(isNewerVersion("1.0.0-beta.1", "1.0.0-beta.2"), true);
    assert.equal(isNewerVersion("1.0.0-beta", "1.0.0-beta.1"), true);
    assert.equal(isNewerVersion("1.0.0-beta.2", "1.0.0-beta.1"), false);
    assert.equal(isNewerVersion("1.0.0-beta.1", "1.0.0"), true);
    assert.equal(isNewerVersion("1.0.0", "1.0.0-beta.1"), false);
  });

  it("fails closed for invalid versions", () => {
    assert.equal(isNewerVersion("not-semver", "1.0.0"), false);
    assert.equal(isNewerVersion("1.0.0", "latest"), false);
    assert.equal(isNewerVersion("01.0.0", "1.0.1"), false);
    assert.equal(isNewerVersion("1.0.0", "1.0.1-beta.01"), false);
  });
});
