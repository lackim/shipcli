export function ShipcliFooter() {
  return (
    <footer className="border-t border-neutral-800 py-8 mt-20">
      <div className="max-w-4xl mx-auto px-6 flex justify-between items-center text-sm text-neutral-500">
        <span>{{name}}</span>
        <a
          href="https://shipcli.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-neutral-300 transition-colors"
        >
          Built with <span className="text-cyan-400">shipcli</span>
        </a>
      </div>
    </footer>
  );
}
