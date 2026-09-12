import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

export type ConfigData = Record<string, unknown>;
export type ConfigMigration = (data: ConfigData) => ConfigData;

export interface ConfigOptions {
  migrations?: ConfigMigration[];
}

function isRecord(value: unknown): value is ConfigData {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateKey(key: string): string[] {
  const parts = key.split(".");
  for (const part of parts) {
    if (FORBIDDEN_KEYS.has(part)) {
      throw new Error(`Invalid config key: ${key}`);
    }
  }
  return parts;
}

export class Config {
  readonly toolName: string;
  dir: string;
  path: string;
  readonly migrations: ConfigMigration[];
  private _data: ConfigData | null;

  constructor(toolName: string, options: ConfigOptions = {}) {
    this.toolName = toolName;
    this.dir = join(homedir(), `.${toolName}`);
    this.path = join(this.dir, "config.json");
    this.migrations = options.migrations || [];
    this._data = null;
  }

  load() {
    if (!existsSync(this.path)) {
      this._data = {};
      return this;
    }
    try {
      const parsed: unknown = JSON.parse(readFileSync(this.path, "utf-8"));
      this._data = isRecord(parsed) ? parsed : {};
    } catch {
      this._data = {};
    }
    for (const migration of this.migrations) {
      this._data = migration(this._data);
    }
    return this;
  }

  save() {
    if (!existsSync(this.dir)) {
      mkdirSync(this.dir, { recursive: true, mode: 0o700 });
    }
    writeFileSync(this.path, JSON.stringify(this._data, null, 2) + "\n", { mode: 0o600 });
    return this;
  }

  get data(): ConfigData {
    if (!this._data) this.load();
    return this._data as ConfigData;
  }

  get(key: string): unknown {
    const parts = validateKey(key);
    let obj: unknown = this.data;
    for (const part of parts) {
      if (!isRecord(obj)) return undefined;
      obj = obj[part];
    }
    return obj;
  }

  set(key: string, value: unknown): this {
    const parts = validateKey(key);
    let obj = this.data;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!isRecord(obj[part])) {
        obj[part] = {};
      }
      obj = obj[part] as ConfigData;
    }
    obj[parts[parts.length - 1]] = value;
    return this;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): this {
    const parts = validateKey(key);
    let obj = this.data;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!isRecord(obj[part])) return this;
      obj = obj[part] as ConfigData;
    }
    delete obj[parts[parts.length - 1]];
    return this;
  }

  clear() {
    this._data = {};
    return this;
  }
}
