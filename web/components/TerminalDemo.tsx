"use client";

import { useEffect, useRef, useState } from "react";

const DEMO_LINES = [
  { text: "$ npx @shipcli/create signal-check", tone: "command" },
  { text: "", tone: "muted" },
  { text: "==> Creating signal-check", tone: "phase" },
  { text: "    created package.json", tone: "muted" },
  { text: "    created src/cli.ts", tone: "muted" },
  { text: "    created test/cli.test.ts", tone: "muted" },
  { text: "    initialized git repository", tone: "muted" },
  { text: "--> signal-check created", tone: "success" },
  { text: "", tone: "muted" },
  { text: "$ cd signal-check && npm test", tone: "command" },
  { text: "✓ CLI exposes help and version", tone: "success" },
  { text: "✓ 1 test passed", tone: "success" },
  { text: "", tone: "muted" },
  { text: "$ npm start -- github.com/acme/repo --share", tone: "command" },
  { text: "==> Analyzing github.com/acme/repo", tone: "phase" },
  { text: "--> Share image saved: signal-check-result.png", tone: "success" },
  { text: "", tone: "muted" },
  { text: "$ shipcli build --targets macos-arm64,linux-x64", tone: "command" },
  { text: "✓ macOS (Apple Silicon)", tone: "success" },
  { text: "✓ Linux (x64)", tone: "success" },
  { text: "--> 2 binaries ready in dist/", tone: "success" },
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
      timers.push(setTimeout(() => setVisibleLines(index + 1), 350 + index * 230));
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
    <div className="terminal" aria-label="Animated shipcli workflow">
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: "#ff5f57" }} />
        <div className="terminal-dot" style={{ background: "#febc2e" }} />
        <div className="terminal-dot" style={{ background: "#28c840" }} />
        <span className="terminal-title">signal-check — zsh</span>
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
