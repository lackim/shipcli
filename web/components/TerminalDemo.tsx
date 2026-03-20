"use client";

import { useState, useEffect } from "react";

const DEMO_LINES = [
  { text: "$ npx create-shipcli my-cli", delay: 0, color: "#e5e5e5" },
  { text: "", delay: 400 },
  { text: "==> Scaffolding my-cli", delay: 600, color: "#06b6d4" },
  { text: "    created package.json", delay: 800, color: "#737373" },
  { text: "    created src/cli.js", delay: 900, color: "#737373" },
  { text: "    created src/commands/index.js", delay: 1000, color: "#737373" },
  { text: "--> Project created!", delay: 1200, color: "#22c55e" },
  { text: "", delay: 1400 },
  { text: "$ cd my-cli && node src/cli.js --help", delay: 1600, color: "#e5e5e5" },
  { text: "", delay: 1900 },
  { text: "Usage: my-cli [options] [command]", delay: 2100, color: "#737373" },
  { text: "", delay: 2200 },
  { text: "Options:", delay: 2400, color: "#06b6d4" },
  { text: "  --json     Output as JSON", delay: 2500, color: "#737373" },
  { text: "  --share    Generate shareable output", delay: 2600, color: "#737373" },
  { text: "  --help     Display help", delay: 2700, color: "#737373" },
  { text: "", delay: 2800 },
  { text: "$ shipcli publish --bump minor", delay: 3000, color: "#e5e5e5" },
  { text: "", delay: 3200 },
  { text: "==> Publishing my-cli", delay: 3400, color: "#06b6d4" },
  { text: "    Bumped version: 0.1.0 → 0.2.0", delay: 3600, color: "#737373" },
  { text: "    Created git tag: v0.2.0", delay: 3800, color: "#737373" },
  { text: "--> Published to npm!", delay: 4000, color: "#22c55e" },
];

export function TerminalDemo() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    DEMO_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), line.delay + 200)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: "#ff5f57" }} />
        <div className="terminal-dot" style={{ background: "#febc2e" }} />
        <div className="terminal-dot" style={{ background: "#28c840" }} />
        <span
          style={{ marginLeft: 12, color: "#737373", fontSize: 12 }}
        >
          shipcli
        </span>
      </div>
      <div className="terminal-body">
        {DEMO_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} style={{ color: line.color || "#e5e5e5" }}>
            {line.text || "\u00A0"}
          </div>
        ))}
        {visibleLines < DEMO_LINES.length && (
          <span className="animate-pulse" style={{ color: "#06b6d4" }}>
            ▋
          </span>
        )}
      </div>
    </div>
  );
}
