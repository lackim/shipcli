import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { generateOgImage, share } from "../packages/share/src/index.js";

function card(data) {
  return {
    type: "div",
    props: {
      style: {
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        fontFamily: "Inter",
        fontSize: 48,
        height: "100%",
        width: "100%",
      },
      children: data.title,
    },
  };
}

test("generateOgImage renders a PNG without network access", async () => {
  var png = await generateOgImage(card, { title: "shipcli" }, { width: 600, height: 315 });

  assert.ok(png.length > 1_000);
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
});

test("share writes a sanitized PNG filename", async (t) => {
  var outDir = mkdtempSync(join(tmpdir(), "shipcli-share-"));
  t.after(() => rmSync(outDir, { recursive: true, force: true }));

  var output = await share(card, { title: "shipcli" }, {
    filename: "../result.png",
    outDir,
    width: 600,
    height: 315,
  });

  assert.equal(output, join(outDir, "result.png"));
  assert.ok(readFileSync(output).length > 1_000);
});
