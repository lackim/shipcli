const STEPS = [
  {
    number: "01",
    title: "Scaffold",
    command: "npx @shipcli/create my-cli",
    description: "Generate a focused TypeScript CLI with git, tests and CI already in place.",
  },
  {
    number: "02",
    title: "Build",
    command: "shipcli build",
    description: "Compile standalone binaries for macOS, Linux and Windows with Bun.",
  },
  {
    number: "03",
    title: "Package",
    command: "shipcli homebrew",
    description: "Prepare npm metadata, release notes and a Homebrew formula without glue scripts.",
  },
  {
    number: "04",
    title: "Launch",
    command: "shipcli publish --dry-run",
    description: "Validate the package, publish deliberately and generate output worth sharing.",
  },
];

export function FeatureShowcase() {
  return (
    <div className="workflow-grid grid gap-px overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800 md:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step) => (
        <div key={step.title} className="workflow-step bg-neutral-950 p-6 sm:p-7">
          <div className="step-number">{step.number}</div>
          <h3 className="mt-8 text-lg font-semibold text-white">{step.title}</h3>
          <code className="mt-3 block text-xs text-emerald-400">$ {step.command}</code>
          <p className="mt-4 text-sm leading-6 text-neutral-500">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
