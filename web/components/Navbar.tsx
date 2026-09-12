const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const NAV_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: "Workflow", href: BASE_PATH + "/#workflow" },
  { label: "Docs", href: BASE_PATH + "/docs" },
  { label: "GitHub", href: "https://github.com/lackim/shipcli", external: true },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href={BASE_PATH + "/"} className="flex items-center gap-2.5 font-semibold text-neutral-100 transition-colors hover:text-white">
          <span className="brand-mark" aria-hidden="true">›_</span>
          <span>shipcli</span>
        </a>
        <div className="flex items-center gap-4 sm:gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={(link.label === "Workflow" ? "hidden sm:inline " : "") + "text-sm text-neutral-500 transition-colors hover:text-neutral-200"}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
