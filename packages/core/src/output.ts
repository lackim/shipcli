import kleur from "kleur";

type Cell = string | number | boolean | null | undefined;

export function phase(msg: string): void {
  process.stderr.write(`\n${kleur.bold().cyan("==>")} ${kleur.bold(msg)}\n`);
}

export function status(msg: string): void {
  process.stderr.write(`    ${msg}\n`);
}

export function error(msg: string, fix?: string): void {
  process.stderr.write(`\n${kleur.red("Error:")} ${msg}\n`);
  if (fix) process.stderr.write(`  ${fix}\n`);
}

export function fatal(msg: string, fix?: string): never {
  error(msg, fix);
  process.exit(1);
}

export function success(msg: string): void {
  process.stderr.write(`\n${kleur.green("-->")} ${msg}\n`);
}

export function hint(label: string, msg: string): void {
  process.stderr.write(`\n${kleur.dim(label + ":")} ${msg}\n`);
}

export const fmt = {
  app: (name: string) => kleur.cyan(name),
  cmd: (cmd: string) => kleur.bold().cyan(cmd),
  key: (key: string) => kleur.green(key),
  val: (value: string | number) => kleur.yellow(String(value)),
  dim: (text: string) => kleur.dim(text),
  bold: (text: string) => kleur.bold(text),
  url: (url: string) => kleur.underline().cyan(url),
  cloud: (cloud: string) => kleur.magenta(cloud),
  score: (score: number) => {
    if (score >= 80) return kleur.green(String(score));
    if (score >= 50) return kleur.yellow(String(score));
    return kleur.red(String(score));
  },
  grade: (grade: string) => {
    const colors: Record<string, "green" | "yellow" | "red"> = {
      A: "green", B: "green", C: "yellow", D: "red", F: "red",
    };
    const color = colors[grade];
    return color ? kleur[color](grade) : kleur.white(grade);
  },
};

function stripAnsi(str: string): string {
  return String(str).replace(new RegExp("\\u001B\\[[0-9;]*m", "g"), "");
}

function padEnd(str: string, len: number): string {
  const visible = stripAnsi(str).length;
  return str + " ".repeat(Math.max(0, len - visible));
}

export function table(headers: readonly Cell[], rows: readonly (readonly Cell[])[]): string {
  if (rows.length === 0) return "";

  const allRows = [headers, ...rows];
  const widths: number[] = [];
  for (const row of allRows) {
    for (let i = 0; i < row.length; i++) {
      const len = stripAnsi(String(row[i] || "")).length;
      if (!widths[i] || len > widths[i]) widths[i] = len;
    }
  }

  const lines = [];
  lines.push(
    headers
      .map((h, i) => kleur.bold(padEnd(String(h), widths[i] + 2)))
      .join("")
  );
  lines.push(kleur.dim(widths.map((w) => "─".repeat(w)).join("  ")));
  for (const dataRow of rows) {
    lines.push(
      dataRow.map((cell, i) => padEnd(String(cell || ""), widths[i] + 2)).join("")
    );
  }

  return lines.join("\n");
}

export function box(title: string, lines: readonly string[]): string {
  const maxLen = Math.max(
    stripAnsi(title).length,
    ...lines.map((l) => stripAnsi(l).length)
  );
  const width = maxLen + 2;

  const top = `┌${"─".repeat(width)}┐`;
  const mid = `├${"─".repeat(width)}┤`;
  const bot = `└${"─".repeat(width)}┘`;
  const titleLine = `│ ${padEnd(kleur.bold(title), width - 1)}│`;
  const body = lines
    .map((l) => `│ ${padEnd(l, width - 1)}│`)
    .join("\n");

  return `${top}\n${titleLine}\n${mid}\n${body}\n${bot}`;
}

export function progressBar(current: number, total: number, width = 30): string {
  const ratio = total > 0 ? Math.min(Math.max(current / total, 0), 1) : 0;
  const filled = Math.round(width * ratio);
  const empty = width - filled;
  const bar = kleur.green("█".repeat(filled)) + kleur.dim("░".repeat(empty));
  const pct = Math.round(ratio * 100);
  return `${bar} ${pct}%`;
}
