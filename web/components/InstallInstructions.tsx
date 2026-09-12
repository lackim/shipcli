"use client";

import { useState } from "react";

const COMMAND = "npx @shipcli/create my-cli";

export function InstallInstructions() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md">
      <button
        type="button"
        onClick={copy}
        className="command-copy group flex w-full items-center gap-3 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3.5 text-left transition hover:border-neutral-500 hover:bg-neutral-800/80"
        aria-label={"Copy command: " + COMMAND}
      >
        <span className="select-none text-emerald-400">$</span>
        <code className="min-w-0 flex-1 truncate text-sm text-neutral-200">{COMMAND}</code>
        <span className="text-xs text-neutral-600 transition group-hover:text-neutral-400" aria-live="polite">
          {copied ? "copied ✓" : "copy"}
        </span>
      </button>
    </div>
  );
}
