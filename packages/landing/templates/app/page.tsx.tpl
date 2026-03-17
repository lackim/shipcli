import { TerminalDemo } from "../components/TerminalDemo";
import { InstallInstructions } from "../components/InstallInstructions";
import { FeatureShowcase } from "../components/FeatureShowcase";
import { ShipcliFooter } from "../components/ShipcliFooter";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">{{name}}</h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-12">
          {{description}}
        </p>
        <InstallInstructions name="{{name}}" />
      </section>

      {/* Terminal Demo */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <TerminalDemo />
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <FeatureShowcase />
      </section>

      {/* Footer */}
      <ShipcliFooter />
    </main>
  );
}
