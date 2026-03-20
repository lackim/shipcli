const NAV_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: "Docs", href: "/docs" },
  { label: "GitHub", href: "https://github.com/lackim/shipcli", external: true },
];

export function Navbar() {
  if (NAV_LINKS.length === 0) return null;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="font-semibold text-neutral-200 hover:text-white transition-colors">
          shipcli
        </a>
        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
