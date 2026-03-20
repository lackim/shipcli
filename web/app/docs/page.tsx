import { Navbar } from "../../components/Navbar";
import { ShipcliFooter } from "../../components/ShipcliFooter";
import { DocsSidebar } from "../../components/DocsSidebar";

const SIDEBAR = [
  {
    group: "BASICS",
    items: [
      { label: "Getting Started", href: "#getting-started" },
      { label: "Project Structure", href: "#project-structure" },
      { label: "CLI Commands", href: "#commands" },
    ],
  },
  {
    group: "CORE",
    items: [
      { label: "createCLI", href: "#create-cli" },
      { label: "Output", href: "#output" },
      { label: "Formatting", href: "#formatting" },
      { label: "Config", href: "#config" },
      { label: "Spinner", href: "#spinner" },
    ],
  },
  {
    group: "MODULES",
    items: [
      { label: "Share", href: "#share" },
      { label: "Build", href: "#build" },
      { label: "Landing", href: "#landing" },
    ],
  },
  {
    group: "REFERENCE",
    items: [
      { label: "Packages", href: "#packages" },
    ],
  },
];

export default function Docs() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="flex pt-14">
        {/* Sidebar */}
        <DocsSidebar sections={SIDEBAR} />

        {/* Content */}
        <div className="flex-1 min-w-0 max-w-3xl px-8 py-12 lg:ml-64">
          <h1 className="text-4xl font-bold mb-2">Documentation</h1>
          <p className="text-neutral-400 mb-12">
            Everything you need to build, publish, and promote CLI tools with shipcli.
          </p>

          {/* Getting Started */}
          <Section id="getting-started" title="Getting Started">
            <P>
              shipcli is a CLI-as-a-Product toolkit. It helps you scaffold a new CLI project,
              add viral sharing features, publish to npm, build cross-platform binaries,
              and generate landing pages.
            </P>
            <H3>Install</H3>
            <Code>{`npm install -g @shipcli/cli`}</Code>

            <H3>Create your first CLI</H3>
            <Code>{`npx create-shipcli my-cli
cd my-cli

# Run your CLI
node src/cli.js --help

# Publish to npm
shipcli publish --bump patch`}</Code>
          </Section>

          {/* Project Structure */}
          <Section id="project-structure" title="Project Structure">
            <P>A scaffolded project looks like this:</P>
            <Code>{`my-cli/
  package.json          # @shipcli/core + @shipcli/share deps
  shipcli.config.js     # Tool metadata
  src/
    cli.js              # createCLI() entry point
    commands/
      index.js          # Main command`}</Code>
            <P>
              Your CLI imports <Mono>@shipcli/core</Mono> at runtime — it{"'"}s a framework,
              not a template. This means you get updates by bumping a dependency version.
            </P>
          </Section>

          {/* CLI Commands */}
          <Section id="commands" title="CLI Commands">
            <H3>shipcli init [name]</H3>
            <P>Scaffold a new CLI tool. Delegates to <Mono>npx create-shipcli</Mono>.</P>
            <Code>{`shipcli init my-cli`}</Code>

            <H3>shipcli publish</H3>
            <P>Version bump, git tag, and npm publish in one command.</P>
            <Code>{`shipcli publish
shipcli publish --bump minor
shipcli publish --dry-run
shipcli publish --skip-git
shipcli publish --access restricted`}</Code>
            <OptionsTable rows={[
              ["--bump <type>", "Version bump type: major, minor, patch", "patch"],
              ["--dry-run", "Run without actually publishing", "false"],
              ["--skip-git", "Skip git commit and tag", "false"],
              ["--access <type>", "npm access level", "public"],
            ]} />

            <H3>shipcli build</H3>
            <P>Build cross-platform standalone binaries using Bun.</P>
            <Code>{`shipcli build
shipcli build --targets macos-arm64,linux-x64
shipcli build --out-dir bin`}</Code>
            <OptionsTable rows={[
              ["--targets <list>", "Comma-separated: macos-arm64, macos-x64, linux-x64, linux-arm64, windows-x64", "all"],
              ["--out-dir <dir>", "Output directory", "dist"],
            ]} />

            <H3>shipcli homebrew</H3>
            <P>Generate a Homebrew formula from your package.json.</P>
            <Code>{`shipcli homebrew
shipcli homebrew --repo owner/repo --output formula.rb`}</Code>

            <H3>shipcli changelog</H3>
            <P>Generate a CHANGELOG.md from git commits.</P>
            <Code>{`shipcli changelog`}</Code>

            <H3>shipcli landing init</H3>
            <P>Scaffold a Next.js landing page with terminal demo, install instructions, and feature showcase.</P>
            <Code>{`shipcli landing init
shipcli landing init --name my-cli --description "My awesome CLI"`}</Code>
          </Section>

          {/* createCLI */}
          <Section id="create-cli" title="createCLI">
            <P>Create a CLI application. Wraps Commander.js with shipcli conventions.</P>
            <Code>{`import { createCLI } from "@shipcli/core/cli";

const cli = createCLI({
  name: "my-cli",
  description: "My awesome CLI tool",
  version: "0.1.0",
  configDir: ".my-cli",  // → ~/.my-cli/config.json
});

cli.command("run <target>")
  .option("--verbose", "Verbose output")
  .action((target, options) => {
    // your logic
  });

cli.run();`}</Code>
            <P>Automatically adds:</P>
            <ul className="list-disc list-inside text-neutral-400 mb-4 space-y-1">
              <li><Mono>--json</Mono> global flag</li>
              <li>Auto update check (cached 24h, non-blocking)</li>
              <li>Global error handler for uncaught exceptions</li>
            </ul>
          </Section>

          {/* Output */}
          <Section id="output" title="Output">
            <P>Terminal output utilities. All status output goes to stderr so stdout stays clean for piping.</P>
            <Code>{`import { phase, status, success, error, fatal, hint } from "@shipcli/core/output";

phase("Analyzing repository");     // ==> Analyzing repository
status("Fetching commits...");     //     Fetching commits...
success("Analysis complete");      // --> Analysis complete
error("Not found", "Check URL");   // Error: Not found
fatal("Cannot continue");          // Error + process.exit(1)
hint("Tip", "Use --verbose");      // Tip: Use --verbose`}</Code>

            <H3>table(headers, rows)</H3>
            <P>ANSI-aware table with automatic column padding.</P>
            <Code>{`import { table, fmt } from "@shipcli/core/output";

console.log(table(
  ["Name", "Score", "Status"],
  [
    ["react", fmt.score(95), "alive"],
    ["atom", fmt.score(0), "dead"],
  ]
));`}</Code>

            <H3>box(title, lines)</H3>
            <P>Unicode box drawing for highlighted output.</P>
            <Code>{`import { box } from "@shipcli/core/output";

console.log(box("Results", [
  "Total: 42",
  "Passed: 40",
  "Failed: 2",
]));`}</Code>

            <H3>progressBar(current, total)</H3>
            <Code>{`import { progressBar } from "@shipcli/core/output";

console.log(progressBar(7, 10));
// █████████████████████░░░░░░░░░ 70%`}</Code>
          </Section>

          {/* Formatting */}
          <Section id="formatting" title="Formatting">
            <P>Color and style helpers via <Mono>fmt</Mono>.</P>
            <Code>{`import { fmt } from "@shipcli/core/output";

fmt.app("my-cli")      // cyan
fmt.cmd("npm install")  // bold cyan
fmt.key("name")         // green
fmt.val("42")           // yellow
fmt.dim("optional")     // dimmed
fmt.bold("important")   // bold
fmt.url("https://...")   // underline cyan
fmt.score(85)           // green (80+), yellow (50-79), red (<50)
fmt.grade("A")          // green (A/B), yellow (C), red (D/F)`}</Code>
          </Section>

          {/* Config */}
          <Section id="config" title="Config">
            <P>Persistent configuration stored at <Mono>~/.toolname/config.json</Mono>. Supports dot-notation and migrations.</P>
            <Code>{`import { Config } from "@shipcli/core/config";

const config = new Config("my-cli").load();

config.set("github.token", "ghp_...");
config.get("github.token");  // "ghp_..."
config.has("github.token");  // true
config.delete("github.token");
config.save();`}</Code>

            <H3>Migrations</H3>
            <P>Transform config between versions:</P>
            <Code>{`const config = new Config("my-cli", {
  migrations: [
    (data) => {
      // Rename old key
      if (data.apiKey) {
        data.token = data.apiKey;
        delete data.apiKey;
      }
      return data;
    },
  ],
}).load();`}</Code>
          </Section>

          {/* Spinner */}
          <Section id="spinner" title="Spinner">
            <P>Lightweight spinner for async operations. Wraps nanospinner.</P>
            <Code>{`import { spinner } from "@shipcli/core/spinner";

const s = spinner("Loading...").start();

// On success:
s.success({ text: "Done!" });

// On error:
s.error({ text: "Failed" });`}</Code>
          </Section>

          {/* Share */}
          <Section id="share" title="Share">
            <P>Generate shareable OG images (1200x630 PNG) for social media from your CLI output.</P>
            <Code>{`import { share } from "@shipcli/share";

// Template uses Satori h() format
function myCard(data) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#0f0f0f",
        color: "#e5e5e5",
        padding: "48px",
      },
      children: {
        type: "div",
        props: { children: data.title }
      }
    }
  };
}

await share(myCard, reportData, {
  toolName: "my-cli",
  filename: "output.png",
});`}</Code>
            <P>
              Satori renders the element tree to SVG, then resvg converts to PNG.
              The Inter font is loaded automatically from Google Fonts.
            </P>
            <P>
              Add <Mono>--share</Mono> to your CLI command to let users generate shareable cards:
            </P>
            <Code>{`cli.command("analyze <target>")
  .option("--share", "Generate shareable image")
  .action(async (target, options) => {
    const result = analyze(target);
    console.log(renderOutput(result));

    if (options.share) {
      const { share } = await import("@shipcli/share");
      await share(myCard, result, { toolName: "my-cli", filename: "result.png" });
    }
  });`}</Code>
          </Section>

          {/* Build */}
          <Section id="build" title="Build">
            <P>Build and distribution pipeline. Used by the <Mono>shipcli</Mono> CLI commands.</P>

            <H3>npm Publish</H3>
            <Code>{`import { publish } from "@shipcli/build/npm-publish";

publish({
  cwd: process.cwd(),
  bump: "minor",       // major | minor | patch
  dryRun: false,
  skipGit: false,
  access: "public",
});`}</Code>

            <H3>Binary Build</H3>
            <P>Compile standalone executables using <Mono>bun build --compile</Mono>.</P>
            <Code>{`import { build } from "@shipcli/build/binary";

build({
  cwd: process.cwd(),
  outDir: "dist",
  targets: [
    { name: "macos-arm64", bun: "bun-darwin-arm64", label: "macOS (Apple Silicon)" },
    { name: "linux-x64", bun: "bun-linux-x64", label: "Linux (x64)" },
  ],
});`}</Code>

            <H3>Homebrew Formula</H3>
            <Code>{`import { generateFormula } from "@shipcli/build/homebrew";

generateFormula({
  cwd: process.cwd(),
  repo: "owner/repo",
  output: "formula.rb",
});`}</Code>

            <H3>Changelog</H3>
            <Code>{`import { generateChangelog } from "@shipcli/build/changelog";

generateChangelog({ cwd: process.cwd() });
// → Writes CHANGELOG.md grouped by Features / Fixes / Other`}</Code>
          </Section>

          {/* Landing */}
          <Section id="landing" title="Landing">
            <P>Scaffold a Next.js landing page for your CLI tool.</P>
            <Code>{`shipcli landing init`}</Code>
            <P>Generates a <Mono>web/</Mono> directory with:</P>
            <ul className="list-disc list-inside text-neutral-400 mb-4 space-y-1">
              <li>Animated terminal demo component</li>
              <li>Install instructions with click-to-copy (npm / npx tabs)</li>
              <li>Feature showcase grid</li>
              <li>{'"'}Built with shipcli{'"'} footer (flywheel)</li>
              <li>Navbar with optional Docs and GitHub links</li>
              <li>Tailwind CSS + dark mode</li>
              <li>SEO meta tags and Open Graph</li>
            </ul>
            <P>Deploy to Vercel with <Mono>cd web && vercel</Mono>.</P>
          </Section>

          {/* Packages */}
          <Section id="packages" title="Packages">
            <OptionsTable rows={[
              ["@shipcli/core", "CLI framework: output, config, commands, spinner"],
              ["@shipcli/share", "OG image generation for viral sharing"],
              ["@shipcli/build", "npm publish, binary builds, homebrew formulas"],
              ["@shipcli/landing", "Next.js landing page scaffolding"],
              ["@shipcli/create", "npx create-shipcli scaffolding"],
              ["@shipcli/cli", "shipcli CLI orchestrator"],
            ]} />
          </Section>
        </div>
      </div>

      <ShipcliFooter />
    </main>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-neutral-800">{title}</h2>
      {children}
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold mt-8 mb-3">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-neutral-400 mb-4 leading-relaxed">{children}</p>;
}

function Mono({ children }: { children: React.ReactNode }) {
  return <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm text-neutral-200">{children}</code>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-4 overflow-x-auto">
      <code className="text-sm text-neutral-300 leading-relaxed">{children}</code>
    </pre>
  );
}

function OptionsTable({ rows }: { rows: string[][] }) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-neutral-800">
              {row.map((cell, j) => (
                <td key={j} className={`py-2.5 pr-4 ${j === 0 ? "text-neutral-200 font-mono whitespace-nowrap" : "text-neutral-400"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
