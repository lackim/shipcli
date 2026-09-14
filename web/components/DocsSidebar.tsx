"use client";

import { useState, useEffect } from "react";

type SidebarSection = {
  group: string;
  items: { label: string; href: string }[];
};

export function DocsSidebar({ sections }: { sections: SidebarSection[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    const ids = sections.flatMap((s) => s.items.map((i) => i.href.replace("#", "")));
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      <div className="sticky top-16 z-40 w-full border-b border-neutral-800 bg-neutral-950/95 px-5 py-3 backdrop-blur lg:hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-neutral-200">
            On this page
            <span className="text-neutral-500 transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
          </summary>
          <nav aria-label="Documentation sections" className="grid grid-cols-2 gap-x-4 gap-y-2 pt-4 pb-1 text-sm">
            {sections.flatMap((section) => section.items).map((item) => (
              <a key={item.href} href={item.href} className="text-neutral-400 hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
        </details>
      </div>

      <aside className="fixed top-14 left-0 hidden h-[calc(100vh-3.5rem)] w-64 overflow-y-auto border-r border-neutral-800 bg-neutral-950 px-6 py-8 lg:block">
        <div className="text-xs font-semibold text-cyan-400 tracking-widest mb-6">
          DOCUMENTATION
        </div>
        {sections.map((section) => (
          <div key={section.group} className="mb-6">
            <div className="text-[11px] font-semibold text-neutral-500 tracking-widest mb-2">
              {section.group}
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const id = item.href.replace("#", "");
                const isActive = activeId === id;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`block py-1.5 px-3 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-neutral-800 text-white font-medium"
                          : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>
    </>
  );
}
