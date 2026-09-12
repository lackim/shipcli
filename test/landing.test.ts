import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { scaffoldLanding } from "../packages/landing/src/scaffold.js";

test("scaffoldLanding creates valid metadata and escapes JSX text", (t) => {
  const cwd = mkdtempSync(join(tmpdir(), "shipcli-landing-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));

  writeFileSync(
    join(cwd, "package.json"),
    JSON.stringify({ name: "demo-cli", description: 'Analyze <code> & "ship"' })
  );

  scaffoldLanding({ cwd });

  const generatedPackage = JSON.parse(readFileSync(join(cwd, "web/package.json"), "utf-8"));
  assert.equal(generatedPackage.name, "demo-cli-web");

  const page = readFileSync(join(cwd, "web/app/page.tsx"), "utf-8");
  assert.match(page, /Analyze &lt;code&gt; &amp; "ship"/);

  const layout = readFileSync(join(cwd, "web/app/layout.tsx"), "utf-8");
  assert.match(layout, /Analyze <code> & \\"ship\\"/);
});
