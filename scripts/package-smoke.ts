import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

interface PackageExpectation {
  directory: string;
  name: string;
  requiredFiles: string[];
}

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const destination = mkdtempSync(join(tmpdir(), "shipcli-packages-"));
const packages: PackageExpectation[] = [
  { directory: "packages/build", name: "@shipcli/build", requiredFiles: ["package/dist/index.js"] },
  { directory: "packages/cli", name: "@shipcli/cli", requiredFiles: ["package/dist/cli.js"] },
  {
    directory: "packages/core",
    name: "@shipcli/core",
    requiredFiles: [
      "package/dist/index.js",
      "package/dist/index.d.ts",
      "package/dist/project-config.js",
      "package/dist/project-config.d.ts",
    ],
  },
  {
    directory: "packages/create-cli",
    name: "@shipcli/create",
    requiredFiles: [
      "package/dist/index.js",
      "package/templates/package.json.tpl",
      "package/templates/shipcli.config.ts.tpl",
    ],
  },
  {
    directory: "packages/landing",
    name: "@shipcli/landing",
    requiredFiles: [
      "package/dist/scaffold.js",
      "package/templates/app/icon.svg.tpl",
      "package/templates/app/page.tsx.tpl",
    ],
  },
  { directory: "packages/share", name: "@shipcli/share", requiredFiles: ["package/dist/index.js", "package/dist/index.d.ts"] },
];

try {
  for (const pkg of packages) {
    const before = new Set(readdirSync(destination));
    execFileSync("pnpm", ["pack", "--pack-destination", destination], {
      cwd: join(repoRoot, pkg.directory),
      stdio: "pipe",
    });

    const archiveName = readdirSync(destination).find((name) => !before.has(name));
    assert.ok(archiveName, `${pkg.name} did not produce a tarball`);
    const archive = join(destination, archiveName);
    const fileList = execFileSync("tar", ["-tzf", archive], { encoding: "utf-8" }).split("\n");

    for (const required of ["package/package.json", "package/README.md", "package/CHANGELOG.md", ...pkg.requiredFiles]) {
      assert.ok(fileList.includes(required), `${pkg.name} tarball is missing ${required}`);
    }
    assert.equal(fileList.some((file) => file.includes(".tsbuildinfo")), false, `${pkg.name} includes build cache files`);

    const manifestText = execFileSync("tar", ["-xOzf", archive, "package/package.json"], {
      encoding: "utf-8",
    });
    const manifest = JSON.parse(manifestText) as {
      name: string;
      dependencies?: Record<string, string>;
    };
    assert.equal(manifest.name, pkg.name);
    for (const version of Object.values(manifest.dependencies ?? {})) {
      assert.equal(version.startsWith("workspace:"), false, `${pkg.name} contains an unresolved workspace dependency`);
    }

    console.log(`verified ${pkg.name}`);
  }
} finally {
  rmSync(destination, { recursive: true, force: true });
}
