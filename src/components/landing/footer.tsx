import Link from "next/link";

const columns: Array<{ heading: string; links: Array<{ label: string; href: string }> }> = [
  {
    heading: "Product",
    links: [
      { label: "Catalog", href: "/sets" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Market intelligence", href: "/market" },
      { label: "Alerts", href: "/alerts" },
      { label: "BrickX 100", href: "/market" },
    ],
  },
  {
    heading: "Data",
    links: [
      { label: "Methodology", href: "#" },
      { label: "Price sources", href: "#" },
      { label: "Index rules", href: "#" },
      { label: "API (soon)", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Disclaimers", href: "#" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border-thin bg-bg-base">
      <div className="mx-auto max-w-[1200px] px-6 py-16 sm:px-10 lg:px-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-flex size-6 items-center justify-center rounded-md bg-brand-gradient text-[11px] font-semibold text-accent-foreground"
              >
                B
              </span>
              <span className="font-serif-display text-xl italic text-text-primary">
                BrickX
              </span>
            </div>
            <p className="mt-4 max-w-[320px] text-small text-text-secondary">
              LEGO as an asset class. A portfolio tracker, price engine, and
              named-index product for serious collectors.
            </p>
            <div className="mt-6 text-micro font-mono font-tabular text-text-quaternary">
              Not affiliated with the LEGO Group. LEGO® is a trademark of the LEGO
              Group.
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <div className="text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
                {col.heading}
              </div>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-small text-text-secondary transition hover:text-text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border-thin pt-6">
          <span className="text-micro font-mono font-tabular text-text-quaternary">
            © {new Date().getFullYear()} BrickX. All rights reserved.
          </span>
          <div className="flex gap-4">
            {["Twitter", "GitHub", "Discord"].map((s) => (
              <Link
                key={s}
                href="#"
                className="text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary transition hover:text-text-primary"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
