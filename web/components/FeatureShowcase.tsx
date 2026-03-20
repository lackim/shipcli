const FEATURES = [
  {
    title: "Scaffold in Seconds",
    description: "npx create-shipcli generates a complete CLI project with commands, config, and CI/CD.",
    icon: "⚡",
  },
  {
    title: "Viral Sharing",
    description: "Built-in --share flag generates OG images for X/LinkedIn. Make your CLI output go viral.",
    icon: "🖼",
  },
  {
    title: "One-Command Publish",
    description: "Version bump, git tag, and npm publish — all in one command with shipcli publish.",
    icon: "📦",
  },
  {
    title: "Cross-Platform Binaries",
    description: "Build standalone executables for macOS, Linux, and Windows with shipcli build.",
    icon: "🔧",
  },
  {
    title: "Landing Pages",
    description: "Generate a Next.js landing page with terminal demo and install instructions.",
    icon: "🌐",
  },
  {
    title: "Homebrew Ready",
    description: "Auto-generate Homebrew formulas from your package.json with shipcli homebrew.",
    icon: "🍺",
  },
];

export function FeatureShowcase() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
