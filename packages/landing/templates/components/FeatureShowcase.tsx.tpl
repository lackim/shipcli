const FEATURES = [
  {
    title: "Fast Analysis",
    description: "Scans repository data in seconds using the GitHub API.",
    icon: "⚡",
  },
  {
    title: "Shareable Output",
    description: "Generate beautiful OG images for X/LinkedIn with --share.",
    icon: "🖼",
  },
  {
    title: "JSON Export",
    description: "Pipe structured data to other tools with --json.",
    icon: "{}",
  },
  {
    title: "CI Ready",
    description: "Run in GitHub Actions to monitor project health.",
    icon: "⚙",
  },
];

export function FeatureShowcase() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {FEATURES.map((f) => (
        <div
          key={f.title}
          className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors"
        >
          <div className="text-2xl mb-3">{f.icon}</div>
          <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
          <p className="text-neutral-400 text-sm">{f.description}</p>
        </div>
      ))}
    </div>
  );
}
