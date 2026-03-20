import { Navbar } from "../components/Navbar";
import { TerminalDemo } from "../components/TerminalDemo";
import { InstallInstructions } from "../components/InstallInstructions";
import { FeatureShowcase } from "../components/FeatureShowcase";
import { ShipcliFooter } from "../components/ShipcliFooter";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-28 pb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">shipcli</h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-12">
          CLI-as-a-Product toolkit — build, publish, and promote CLI tools
        </p>
        <InstallInstructions name="shipcli" />
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
