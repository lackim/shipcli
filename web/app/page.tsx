import { Navbar } from "../components/Navbar";
import { TerminalDemo } from "../components/TerminalDemo";
import { InstallInstructions } from "../components/InstallInstructions";
import { FeatureShowcase } from "../components/FeatureShowcase";
import { ShipcliFooter } from "../components/ShipcliFooter";
import Image from "next/image";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />

      <section className="hero-grid relative border-b border-neutral-900">
        <div className="hero-glow" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 lg:pt-36 lg:pb-28">
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <div className="eyebrow mb-7">
                <span className="status-dot" />
                Open source · early access
              </div>
              <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
                Ship a CLI people can{" "}
                <span className="accent-text">actually install.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-neutral-400 sm:text-xl">
                A TypeScript toolkit for turning command-line ideas into tested,
                packaged, shareable products — without rebuilding the release
                pipeline every time.
              </p>

              <div className="mt-9">
                <InstallInstructions />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a href={BASE_PATH + "/docs"} className="button-secondary">
                  Read the docs <span aria-hidden="true">→</span>
                </a>
                <a
                  href="https://github.com/lackim/shipcli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-quiet"
                >
                  View on GitHub
                </a>
              </div>
            </div>

            <div className="lg:translate-y-3">
              <div className="mb-4 flex items-center justify-between px-1 text-xs uppercase tracking-[0.18em] text-neutral-600">
                <span>From zero to distributable</span>
                <span className="hidden sm:inline">live workflow</span>
              </div>
              <TerminalDemo />
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-neutral-800 bg-neutral-800 sm:grid-cols-4 lg:mt-20">
            {[
              ["Node.js", "20+"],
              ["Targets", "macOS · Linux · Windows"],
              ["License", "MIT"],
              ["CI", "Cross-platform"],
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
            One toolchain. Four deliberate steps.
          </h2>
          <p className="max-w-md text-sm leading-6 text-neutral-500">
            Use the whole path or import only the package your existing CLI needs.
          </p>
        </div>
        <div className="mt-10">
          <FeatureShowcase />
        </div>
      </section>

      <section id="output" className="section-shell scroll-mt-20 pt-0">
        <div className="result-panel grid overflow-hidden rounded-2xl border border-neutral-800 lg:grid-cols-2">
          <div className="p-7 sm:p-10 lg:p-12">
            <div className="section-kicker">What you get</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Not a toy scaffold.
            </h2>
            <p className="mt-4 max-w-lg leading-7 text-neutral-400">
              Start with a small project that already behaves like a public tool:
              package metadata, tests, CI, version-aware help and an optional share
              card are wired in from day one.
            </p>
            <div className="project-tree mt-8" aria-label="Generated project structure">
              <div><span className="tree-folder">my-cli/</span></div>
              <div>├── src/cli.ts</div>
              <div>├── src/share-card.ts</div>
              <div>├── test/cli.test.ts</div>
              <div>└── .github/workflows/ci.yml</div>
            </div>
          </div>

          <div className="result-preview flex flex-col justify-center border-t border-neutral-800 p-6 sm:p-10 lg:border-l lg:border-t-0">
            <div className="mb-4 flex items-center justify-between text-xs text-neutral-600">
              <span>Generated share card</span>
              <span>PNG · offline</span>
            </div>
            <Image
              src={BASE_PATH + "/shipcli-social-preview.png"}
              alt="shipcli share card reading Build. Package. Launch."
              width={1280}
              height={640}
              unoptimized
              className="w-full rounded-xl border border-neutral-700/80 shadow-2xl shadow-black/60"
            />
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="proof-card p-7 sm:p-10">
            <div className="section-kicker">Built for the unglamorous parts</div>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-white">
              Keep your product logic. Standardize everything around it.
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Predictable CLI output",
                "npm release safeguards",
                "Standalone Bun binaries",
                "Homebrew formula generation",
                "Offline social cards",
                "Next.js landing scaffold",
              ].map((item) => (
                <div key={item} className="proof-item">
                  <span aria-hidden="true">✓</span> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-7 sm:p-10">
            <div className="section-kicker">Built with shipcli</div>
            <div className="mt-6 space-y-3">
              {[
                ["codeautopsy", "Post-mortem analysis for inactive repositories", "https://github.com/lackim/codeautopsy"],
                ["saas-autopsy", "A practical SaaS health analysis CLI", "https://github.com/lackim/saas-autopsy"],
              ].map(([name, description, href]) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  <span>
                    <strong>{name}</strong>
                    <small>{description}</small>
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ShipcliFooter />
    </main>
  );
}
