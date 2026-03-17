"use client";

import { useState } from "react";

const METHODS = [
  { label: "npm", command: "npm install -g {{name}}" },
  { label: "brew", command: "brew install {{name}}" },
  { label: "binary", command: "curl -fsSL https://{{name}}.dev/install | sh" },
];

export function InstallInstructions({ name }: { name: string }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(METHODS[active].command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-block">
      {/* Tabs */}
      <div className="flex gap-1 mb-2 justify-center">
        {METHODS.map((m, i) => (
          <button
            key={m.label}
            onClick={() => setActive(i)}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              i === active
                ? "bg-neutral-800 text-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Command */}
      <div
        onClick={copy}
        className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 cursor-pointer hover:border-neutral-600 transition-colors"
      >
        <span className="text-cyan-400 select-none">$</span>
        <code className="text-neutral-200 text-sm font-mono">
          {METHODS[active].command}
        </code>
        <span className="text-neutral-600 text-sm ml-auto">
          {copied ? "✓ copied" : "click to copy"}
        </span>
      </div>
    </div>
  );
}
