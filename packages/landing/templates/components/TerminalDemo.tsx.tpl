"use client";

import { useEffect, useRef, useState } from "react";

const DEMO_LINES = [
  { text: "$ npm install --global {{name}}", tone: "command" },
  { text: "", tone: "muted" },
  { text: "added {{name}}", tone: "success" },
  { text: "", tone: "muted" },
  { text: "$ {{name}} --help", tone: "command" },
  { text: "Usage: {{name}} [options] [target]", tone: "muted" },
  { text: "", tone: "muted" },
  { text: "{{description}}", tone: "muted" },
  { text: "", tone: "muted" },
  { text: "Options:", tone: "phase" },
  { text: "  --json     Output as JSON", tone: "muted" },
  { text: "  --share    Generate a shareable image", tone: "muted" },
  { text: "  --help     Display help", tone: "muted" },
  { text: "", tone: "muted" },
  { text: "$ {{name}} example --json", tone: "command" },
  { text: '{ "target": "example", "status": "ok" }', tone: "success" },
];

const TONE_COLORS: Record<string, string> = {
  command: "#f5f5f5",
  phase: "#22d3ee",
  muted: "#737373",
  success: "#4ade80",
};

export function TerminalDemo() {
  const [visibleLines, setVisibleLines] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = setTimeout(() => setVisibleLines(DEMO_LINES.length), 0);
      return () => clearTimeout(timer);
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    DEMO_LINES.forEach((_, index) => {
      timers.push(setTimeout(() => setVisibleLines(index + 1), 350 + index * 240));
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: visibleLines > 1 ? "smooth" : "auto",
    });
  }, [visibleLines]);

  return (
    <div className="terminal" aria-label="Animated {{nameText}} terminal demo">
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: "#ff5f57" }} />
        <div className="terminal-dot" style={{ background: "#febc2e" }} />
        <div className="terminal-dot" style={{ background: "#28c840" }} />
        <span className="terminal-title">{{nameText}} — zsh</span>
        <span className="terminal-live"><span /> live</span>
      </div>
      <div ref={bodyRef} className="terminal-body" aria-live="polite">
        {DEMO_LINES.slice(0, visibleLines).map((line, index) => (
          <div key={index} style={{ color: TONE_COLORS[line.tone] }}>
            {line.text || "\u00A0"}
          </div>
        ))}
        {visibleLines < DEMO_LINES.length && (
          <span className="animate-pulse text-cyan-400">▋</span>
        )}
      </div>
    </div>
  );
}
