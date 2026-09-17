import { Navbar } from "../components/Navbar";
import { TerminalDemo } from "../components/TerminalDemo";
import { InstallInstructions } from "../components/InstallInstructions";
import { FeatureShowcase } from "../components/FeatureShowcase";
import { ShipcliFooter } from "../components/ShipcliFooter";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />

      <section className="hero-grid relative border-b border-neutral-900">
        <div className="hero-glow" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-28 lg:pb-28 lg:pt-36">
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="min-w-0">
              <div className="eyebrow mb-7">
                <span className="status-dot" />
                Command-line product
              </div>
              <h1 className="max-w-xl break-words text-5xl font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-6xl sm:leading-[1.06] lg:text-7xl">
                Meet <span className="accent-text">{{nameText}}</span>.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-neutral-400 sm:text-xl">
                {{descriptionText}}
              </p>

              <div id="install" className="mt-9 scroll-mt-24">
                <InstallInstructions />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a href="#workflow" className="button-secondary">
                  See how it works <span aria-hidden="true">→</span>
                </a>
                <a href="#output" className="button-quiet">
                  Preview the output
                </a>
              </div>
            </div>

            <div className="min-w-0 lg:translate-y-3">
              <div className="mb-4 flex items-center justify-between px-1 text-xs uppercase tracking-[0.18em] text-neutral-600">
                <span>Live terminal</span>
                <span className="hidden sm:inline">ready to run</span>
              </div>
              <TerminalDemo />
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-neutral-800 bg-neutral-800 sm:grid-cols-4 lg:mt-20">
            {[
              ["Runtime", "Node.js 24+"],
              ["Output", "Human + JSON"],
              ["Automation", "CI friendly"],
              ["License", "MIT"],
            ].map(([label, value]) => (
              <div key={label} className="bg-neutral-950/95 px-5 py-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-600">{label}</div>
                <div className="mt-1 text-sm font-medium text-neutral-300">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="section-shell scroll-mt-20">
        <div className="section-kicker">The workflow</div>
        <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Install once. Use it everywhere.
          </h2>
          <p className="max-w-md text-sm leading-6 text-neutral-500">
            Friendly in a terminal, predictable in scripts, and ready for automated workflows.
          </p>
        </div>
        <div className="mt-10">
          <FeatureShowcase />
        </div>
      </section>

      <section id="output" className="section-shell scroll-mt-20 pt-0">
        <div className="result-panel grid overflow-hidden rounded-2xl border border-neutral-800 lg:grid-cols-2">
          <div className="p-7 sm:p-10 lg:p-12">
            <div className="section-kicker">Built for real workflows</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Useful to people. Reliable for scripts.
            </h2>
            <p className="mt-4 max-w-lg leading-7 text-neutral-400">
              Clear terminal feedback keeps interactive work readable, while structured
              output makes {{nameText}} easy to compose with the rest of your toolchain.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Readable status output", "Structured JSON mode", "Shareable result cards", "Automation-ready exit codes"].map((item) => (
                <div key={item} className="proof-item">
                  <span aria-hidden="true">✓</span> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="result-preview flex flex-col justify-center border-t border-neutral-800 p-6 sm:p-10 lg:border-l lg:border-t-0">
            <div className="mb-4 flex items-center justify-between text-xs text-neutral-600">
              <span>Structured output</span>
              <span>JSON</span>
            </div>
            <pre className="output-card" aria-label="Example JSON output"><code>{`{
  "target": "example",
  "status": "ok",
  "shareImage": null
}`}</code></pre>
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="cta-card flex flex-col items-start justify-between gap-8 p-7 sm:p-10 md:flex-row md:items-center">
          <div>
            <div className="section-kicker">Ready when you are</div>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              Put {{nameText}} in your terminal.
            </h2>
          </div>
          <InstallInstructions />
        </div>
      </section>

      <ShipcliFooter />
    </main>
  );
}
