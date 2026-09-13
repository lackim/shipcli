const STEPS = [
  {
    number: "01",
    title: "Install",
    command: "npm install -g {{name}}",
    description: "Add the CLI globally and make it available from any working directory.",
  },
  {
    number: "02",
    title: "Explore",
    command: "{{name}} --help",
    description: "Discover commands and options through predictable, version-aware help.",
  },
  {
    number: "03",
    title: "Automate",
    command: "{{name}} example --json",
    description: "Use structured output in scripts, pipelines, and continuous integration.",
  },
  {
    number: "04",
    title: "Share",
    command: "{{name}} example --share",
    description: "Turn a useful result into a polished image without leaving the terminal.",
  },
];

export function FeatureShowcase() {
  return (
    <div className="workflow-grid grid gap-px overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800 md:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step) => (
        <div key={step.title} className="workflow-step bg-neutral-950 p-6 sm:p-7">
          <div className="step-number">{step.number}</div>
          <h3 className="mt-8 text-lg font-semibold text-white">{step.title}</h3>
          <code className="mt-3 block overflow-hidden text-ellipsis text-xs text-emerald-400">$ {step.command}</code>
          <p className="mt-4 text-sm leading-6 text-neutral-500">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
