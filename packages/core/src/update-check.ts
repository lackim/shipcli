import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { hint, fmt } from "./output.js";

const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

interface UpdateCache {
  lastCheck?: number;
  latestVersion?: string;
}

interface ParsedVersion {
  core: [bigint, bigint, bigint];
  prerelease: string[];
}

const VERSION_RE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function parseVersion(version: string): ParsedVersion | null {
  const match = VERSION_RE.exec(version);
  if (!match) return null;

  const prerelease = match[4]?.split(".") ?? [];
  if (prerelease.some((part) => /^\d+$/.test(part) && part.length > 1 && part.startsWith("0"))) {
    return null;
  }

  return {
    core: [BigInt(match[1]), BigInt(match[2]), BigInt(match[3])],
    prerelease,
  };
}

function comparePrerelease(current: string[], candidate: string[]): number {
  if (current.length === 0 || candidate.length === 0) {
    if (current.length === candidate.length) return 0;
    return candidate.length === 0 ? 1 : -1;
  }

  const length = Math.max(current.length, candidate.length);
  for (let index = 0; index < length; index += 1) {
    const currentPart = current[index];
    const candidatePart = candidate[index];

    if (currentPart === undefined) return 1;
    if (candidatePart === undefined) return -1;
    if (currentPart === candidatePart) continue;

    const currentNumeric = /^\d+$/.test(currentPart);
    const candidateNumeric = /^\d+$/.test(candidatePart);
    if (currentNumeric && candidateNumeric) {
      return BigInt(candidatePart) > BigInt(currentPart) ? 1 : -1;
    }
    if (currentNumeric !== candidateNumeric) return candidateNumeric ? -1 : 1;
    return candidatePart > currentPart ? 1 : -1;
  }

  return 0;
}

export function isNewerVersion(currentVersion: string, candidateVersion: string): boolean {
  const current = parseVersion(currentVersion);
  const candidate = parseVersion(candidateVersion);
  if (!current || !candidate) return false;

  for (let index = 0; index < current.core.length; index += 1) {
    if (candidate.core[index] === current.core[index]) continue;
    return candidate.core[index] > current.core[index];
  }

  return comparePrerelease(current.prerelease, candidate.prerelease) > 0;
}

export async function checkForUpdate(name: string, currentVersion: string): Promise<void> {
  if (process.env.CI || process.env.NO_UPDATE_NOTIFIER || process.env.SHIPCLI_DISABLE_UPDATE_CHECK === "1") {
    return;
  }

  try {
    const cacheDir = join(homedir(), `.${name}`);
    const cachePath = join(cacheDir, "update-check.json");

    let cache: UpdateCache = {};
    if (existsSync(cachePath)) {
      try {
        const parsed: unknown = JSON.parse(readFileSync(cachePath, "utf-8"));
        if (parsed && typeof parsed === "object") cache = parsed as UpdateCache;
      } catch {}
    }

    if (cache.lastCheck && Date.now() - cache.lastCheck < CHECK_INTERVAL) {
      if (cache.latestVersion && isNewerVersion(currentVersion, cache.latestVersion)) {
        showUpdateHint(name, currentVersion, cache.latestVersion);
      }
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`https://registry.npmjs.org/${name}/latest`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return;
    const data: unknown = await res.json();
    if (!data || typeof data !== "object" || !("version" in data) || typeof data.version !== "string") return;
    const latest = data.version;

    if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
    writeFileSync(cachePath, JSON.stringify({ lastCheck: Date.now(), latestVersion: latest }));

    if (isNewerVersion(currentVersion, latest)) {
      showUpdateHint(name, currentVersion, latest);
    }
  } catch {
    // Silent fail — update check should never break the CLI
  }
}

function showUpdateHint(name: string, current: string, latest: string): void {
  hint("Update available", `${fmt.dim(current)} → ${fmt.val(latest)}  Run ${fmt.cmd(`npm i -g ${name}`)} to update`);
}
