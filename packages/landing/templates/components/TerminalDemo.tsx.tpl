"use client";

import { useState, useEffect } from "react";

const DEMO_LINES = [
  { text: "$ {{name}} --help", delay: 0, color: "#e5e5e5" },
  { text: "", delay: 300 },
  { text: "Usage: {{name}} [options] [target]", delay: 400, color: "#737373" },
  { text: "", delay: 500 },
  { text: "{{description}}", delay: 600, color: "#737373" },
  { text: "", delay: 700 },
  { text: "Options:", delay: 800, color: "#06b6d4" },
  { text: "  --share    Generate shareable output", delay: 900, color: "#737373" },
  { text: "  --json     Output as JSON", delay: 1000, color: "#737373" },
  { text: "  --help     Display help", delay: 1100, color: "#737373" },
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
          {{name}}
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
