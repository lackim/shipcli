import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { hint, fmt } from "./output.js";

const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

interface UpdateCache {
  lastCheck?: number;
  latestVersion?: string;
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
      if (cache.latestVersion && cache.latestVersion !== currentVersion) {
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

    if (latest !== currentVersion) {
      showUpdateHint(name, currentVersion, latest);
    }
  } catch {
    // Silent fail — update check should never break the CLI
  }
}

function showUpdateHint(name: string, current: string, latest: string): void {
  hint("Update available", `${fmt.dim(current)} → ${fmt.val(latest)}  Run ${fmt.cmd(`npm i -g ${name}`)} to update`);
}
