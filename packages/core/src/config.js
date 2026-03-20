import { readFileSync, writeFileSync, existsSync, mkdirSync, chmodSync } from "fs";
import { join } from "path";
import { homedir } from "os";

export class Config {
  constructor(toolName, options = {}) {
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
      this._data = JSON.parse(readFileSync(this.path, "utf-8"));
    } catch {
      this._data = {};
    }
    for (var migration of this.migrations) {
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

  get data() {
    if (!this._data) this.load();
    return this._data;
  }

  get(key) {
    var parts = key.split(".");
    var obj = this.data;
    for (var part of parts) {
      if (obj == null || typeof obj !== "object") return undefined;
      obj = obj[part];
    }
    return obj;
  }

  set(key, value) {
    var parts = key.split(".");
    var obj = this.data;
    for (var i = 0; i < parts.length - 1; i++) {
      if (obj[parts[i]] == null || typeof obj[parts[i]] !== "object") {
        obj[parts[i]] = {};
      }
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    return this;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    var parts = key.split(".");
    var obj = this.data;
    for (var i = 0; i < parts.length - 1; i++) {
      if (obj[parts[i]] == null || typeof obj[parts[i]] !== "object") return this;
      obj = obj[parts[i]];
    }
    delete obj[parts[parts.length - 1]];
    return this;
  }

  clear() {
    this._data = {};
    return this;
  }
}
