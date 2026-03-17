import { join } from "path";
import { homedir } from "os";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { hint, fmt } from "./output.js";

var CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

export async function checkForUpdate(name, currentVersion) {
  try {
    var cacheDir = join(homedir(), `.${name}`);
    var cachePath = join(cacheDir, "update-check.json");

    var cache = {};
    if (existsSync(cachePath)) {
      try {
        cache = JSON.parse(readFileSync(cachePath, "utf-8"));
      } catch {}
    }

    if (cache.lastCheck && Date.now() - cache.lastCheck < CHECK_INTERVAL) {
      if (cache.latestVersion && cache.latestVersion !== currentVersion) {
        showUpdateHint(name, currentVersion, cache.latestVersion);
      }
      return;
    }

    var controller = new AbortController();
    var timeout = setTimeout(() => controller.abort(), 3000);

    var res = await fetch(`https://registry.npmjs.org/${name}/latest`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return;
    var data = await res.json();
    var latest = data.version;

    if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
    writeFileSync(cachePath, JSON.stringify({ lastCheck: Date.now(), latestVersion: latest }));

    if (latest !== currentVersion) {
      showUpdateHint(name, currentVersion, latest);
    }
  } catch {
    // Silent fail — update check should never break the CLI
  }
}

function showUpdateHint(name, current, latest) {
  hint("Update available", `${fmt.dim(current)} → ${fmt.val(latest)}  Run ${fmt.cmd(`npm i -g ${name}`)} to update`);
}
