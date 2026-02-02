import Link from "next/link";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";

const footerSections = [
  {
    title: "Product",
    links: [
      { href: "/sets", label: "Browse Sets" },
      { href: "#", label: "Trending" },
      { href: "#", label: "Price Guide" },
      { href: "/portfolio", label: "Portfolio" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "#", label: "Getting Started" },
      { href: "#", label: "API Docs" },
      { href: "#", label: "Blog" },
      { href: "#", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#", label: "About" },
      { href: "#", label: "Contact" },
      { href: "#", label: "Privacy" },
      { href: "#", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-card border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Logo variant="full" />
            <p className="text-muted-foreground mt-3 text-sm">
              Track LEGO set values, build your portfolio, and make smarter
              investment decisions.
            </p>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <p className="text-muted-foreground text-center text-sm">
          &copy; {new Date().getFullYear()} BrickX. All rights reserved. LEGO is
          a trademark of the LEGO Group, which does not sponsor or endorse this
          site.
        </p>
      </div>
    </footer>
  );
}
