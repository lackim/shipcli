import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

interface PackageVersion {
  name: string;
  version: string;
}

interface RegistryDocument {
  "dist-tags"?: { latest?: string };
  versions?: Record<string, { dist?: { attestations?: { provenance?: unknown } } }>;
}

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const packageDirectories = ["build", "cli", "core", "create-cli", "landing", "share"];
const packages: PackageVersion[] = packageDirectories.map((directory) => {
  return JSON.parse(
    readFileSync(resolve(repoRoot, "packages", directory, "package.json"), "utf-8"),
  ) as PackageVersion;
});

const maxAttempts = 18;
const retryDelayMs = 10_000;

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  const pending: string[] = [];

  await Promise.all(packages.map(async (pkg) => {
    const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg.name)}`, {
      headers: { "cache-control": "no-cache" },
    });
    if (!response.ok) {
      pending.push(`${pkg.name} (registry returned ${response.status})`);
      return;
    }

    const metadata = await response.json() as RegistryDocument;
    const release = metadata.versions?.[pkg.version];
    if (!release || metadata["dist-tags"]?.latest !== pkg.version) {
      pending.push(`${pkg.name}@${pkg.version}`);
      return;
    }
    if (!release.dist?.attestations?.provenance) {
      pending.push(`${pkg.name}@${pkg.version} (missing provenance)`);
      return;
    }

    console.log(`verified ${pkg.name}@${pkg.version}`);
  }));

  if (pending.length === 0) process.exit(0);
  if (attempt === maxAttempts) {
    throw new Error(`Release verification timed out: ${pending.join(", ")}`);
  }

  console.log(`registry propagation pending (${attempt}/${maxAttempts}): ${pending.join(", ")}`);
  await new Promise((resolveDelay) => setTimeout(resolveDelay, retryDelayMs));
}
