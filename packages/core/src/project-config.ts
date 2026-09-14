import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export type ShipcliBump = "major" | "minor" | "patch";
export type ShipcliPackageAccess = "public" | "restricted";

export interface ShipcliBuildConfig {
  entrypoint?: string;
  outDir?: string;
  targets?: string[];
}

export interface ShipcliPublishConfig {
  access?: ShipcliPackageAccess;
  bump?: ShipcliBump;
}

export interface ShipcliShareConfig {
  enabled?: boolean;
}

export interface ShipcliLandingConfig {
  outDir?: string;
}

export interface ShipcliProjectConfig {
  name?: string;
  description?: string;
  build?: ShipcliBuildConfig;
  publish?: ShipcliPublishConfig;
  share?: ShipcliShareConfig;
  landing?: ShipcliLandingConfig;
}

const CONFIG_FILENAMES = [
  "shipcli.config.ts",
  "shipcli.config.mts",
  "shipcli.config.js",
  "shipcli.config.mjs",
] as const;

export function defineConfig<T extends ShipcliProjectConfig>(config: T): T {
  return config;
}

export async function loadShipcliConfig(cwd = process.cwd()): Promise<ShipcliProjectConfig> {
  const configPath = CONFIG_FILENAMES
    .map((filename) => resolve(cwd, filename))
    .find((candidate) => existsSync(candidate));

  if (!configPath) return {};

  const loaded: unknown = await import(pathToFileURL(configPath).href);
  const config = loaded && typeof loaded === "object" && "default" in loaded
    ? (loaded as { default: unknown }).default
    : undefined;

  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error(`${configPath} must export a configuration object as default.`);
  }

  return config as ShipcliProjectConfig;
}
