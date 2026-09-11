const LEGAL_LINKS: { label: string; href: string }[] = [
  // Uncomment when needed:
  // { label: "Privacy", href: "/privacy" },
  // { label: "Terms", href: "/terms" },
];

export function ShipcliFooter() {
  return (
    <footer className="border-t border-neutral-800 py-8 mt-20">
      <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
        <span>{{nameText}}</span>
        {LEGAL_LINKS.length > 0 && (
          <div className="flex gap-4">
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-neutral-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
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
