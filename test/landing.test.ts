import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

import {
  normalizeRepositoryUrl,
  resolveLandingOutDir,
  scaffoldLanding,
} from "../packages/landing/src/scaffold.js";

test("scaffoldLanding creates valid metadata and escapes JSX text", (t) => {
  const cwd = mkdtempSync(join(tmpdir(), "shipcli-landing-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));

  writeFileSync(
    join(cwd, "package.json"),
    JSON.stringify({
      name: "demo-cli",
      description: 'Analyze <code> & "ship"',
      repository: { url: "git+https://github.com/example/demo-cli.git" },
    })
  );

  scaffoldLanding({ cwd });

  const generatedPackage = JSON.parse(readFileSync(join(cwd, "web/package.json"), "utf-8"));
  assert.equal(generatedPackage.name, "demo-cli-web");

  const page = readFileSync(join(cwd, "web/app/page.tsx"), "utf-8");
  assert.match(page, /Analyze &lt;code&gt; &amp; "ship"/);
  assert.match(page, /id="workflow"/);
  assert.match(page, /Structured output/);

  const layout = readFileSync(join(cwd, "web/app/layout.tsx"), "utf-8");
  assert.match(layout, /Analyze <code> & \\"ship\\"/);

  const install = readFileSync(join(cwd, "web/components/InstallInstructions.tsx"), "utf-8");
  assert.match(install, /npm install --global demo-cli/);
  assert.match(install, /npx demo-cli --help/);
  assert.doesNotMatch(install, /curl|brew install/);

  const terminal = readFileSync(join(cwd, "web/components/TerminalDemo.tsx"), "utf-8");
  assert.match(terminal, /useRef<HTMLDivElement>/);
  assert.match(terminal, /prefers-reduced-motion/);
  assert.match(terminal, /scrollTo/);

  const styles = readFileSync(join(cwd, "web/app/globals.css"), "utf-8");
  assert.match(styles, /\.terminal \{[\s\S]*height: 22rem/);
  assert.match(styles, /\.terminal-body \{[\s\S]*overflow-y: auto/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);

  const footer = readFileSync(join(cwd, "web/components/ShipcliFooter.tsx"), "utf-8");
  assert.match(footer, /github\.com\/lackim\/shipcli/);
  assert.match(footer, /href: "\/privacy"/);
  assert.match(footer, /href: "\/terms"/);
  assert.match(footer, /import Link from "next\/link"/);
  assert.doesNotMatch(footer, /shipcli\.dev/);

  const privacy = readFileSync(join(cwd, "web/app/privacy/page.tsx"), "utf-8");
  assert.match(privacy, /does not use[\s\S]*analytics/);
  assert.match(privacy, /https:\/\/github\.com\/example\/demo-cli/);

  const terms = readFileSync(join(cwd, "web/app/terms/page.tsx"), "utf-8");
  assert.match(terms, /Software license/);
  assert.match(terms, /provided on an &quot;as is&quot;/);
});

test("scaffoldLanding respects a configured output directory", (t) => {
  const cwd = mkdtempSync(join(tmpdir(), "shipcli-landing-output-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));

  scaffoldLanding({ cwd, name: "demo-cli", description: "Demo", outDir: "site" });

  assert.equal(readFileSync(join(cwd, "site/package.json"), "utf-8").includes("demo-cli-web"), true);
});

test("landing output directory cannot escape or replace the project root", () => {
  assert.equal(resolveLandingOutDir("/tmp/project", "site"), resolve("/tmp/project", "site"));
  assert.throws(() => resolveLandingOutDir("/tmp/project", "."), /Invalid output directory/);
  assert.throws(() => resolveLandingOutDir("/tmp/project", "../site"), /Invalid output directory/);
});

test("repository URLs are normalized for generated legal contact links", () => {
  assert.equal(
    normalizeRepositoryUrl("git+https://github.com/example/demo.git"),
    "https://github.com/example/demo",
  );
  assert.equal(
    normalizeRepositoryUrl("git@github.com:example/demo.git"),
    "https://github.com/example/demo",
  );
  assert.equal(normalizeRepositoryUrl({ url: "https://example.com/repo.git" }), "https://example.com/repo");
  assert.equal(normalizeRepositoryUrl(undefined), "");
});
