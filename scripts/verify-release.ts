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

function readPositiveInteger(name: string, fallback: number): number {
  const value = process.env[name];
  if (value === undefined) return fallback;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return parsed;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const packageDirectories = ["build", "cli", "core", "create-cli", "landing", "share"];
const packages: PackageVersion[] = packageDirectories.map((directory) => {
  return JSON.parse(
    readFileSync(resolve(repoRoot, "packages", directory, "package.json"), "utf-8"),
  ) as PackageVersion;
});

// npm registry metadata can take several minutes to converge after a successful
// publish. Keep the verification strict, but allow enough time for propagation.
const maxAttempts = readPositiveInteger("VERIFY_RELEASE_MAX_ATTEMPTS", 60);
const retryDelayMs = readPositiveInteger("VERIFY_RELEASE_RETRY_DELAY_MS", 10_000);

async function verifyPackage(pkg: PackageVersion): Promise<string | null> {
  try {
    const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg.name)}`, {
      cache: "no-store",
      headers: {
        "cache-control": "no-cache, no-store",
        pragma: "no-cache",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      return `${pkg.name} (registry returned ${response.status})`;
    }

    const metadata = await response.json() as RegistryDocument;
    const release = metadata.versions?.[pkg.version];
    if (!release) {
      return `${pkg.name}@${pkg.version} (version not visible)`;
    }

    const latest = metadata["dist-tags"]?.latest;
    if (latest !== pkg.version) {
      return `${pkg.name}@${pkg.version} (latest is ${latest ?? "missing"})`;
    }

    if (!release.dist?.attestations?.provenance) {
      return `${pkg.name}@${pkg.version} (missing provenance)`;
    }

    console.log(`verified ${pkg.name}@${pkg.version}`);
    return null;
  } catch (error) {
    return `${pkg.name}@${pkg.version} (${errorMessage(error)})`;
  }
}

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  const results = await Promise.all(packages.map(verifyPackage));
  const pending = results.filter((result): result is string => result !== null).sort();

  if (pending.length === 0) process.exit(0);
  if (attempt === maxAttempts) {
    throw new Error(`Release verification timed out: ${pending.join(", ")}`);
  }

  console.log(`registry propagation pending (${attempt}/${maxAttempts}): ${pending.join(", ")}`);
  await new Promise((resolveDelay) => setTimeout(resolveDelay, retryDelayMs));
}
