import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SetDetailBreadcrumbProps {
  themeName: string | null;
  themeSlug: string | null;
  setName: string;
}

export function SetDetailBreadcrumb({
  themeName,
  themeSlug,
  setName,
}: SetDetailBreadcrumbProps) {
  const Crumb = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center gap-1.5 text-text-tertiary">
      <ChevronRight className="size-3 text-text-quaternary" strokeWidth={2} />
      {children}
    </span>
  );
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-micro font-mono font-tabular tracking-[0.06em]"
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link
            href="/sets"
            className="text-text-tertiary transition hover:text-text-primary"
          >
            Catalog
          </Link>
        </li>
        {themeName && themeSlug && (
          <li>
            <Crumb>
              <Link
                href={`/themes/${themeSlug}`}
                className="text-text-tertiary transition hover:text-text-primary"
              >
                {themeName}
              </Link>
            </Crumb>
          </li>
        )}
        <li>
          <Crumb>
            <span className="text-text-secondary">{setName}</span>
          </Crumb>
        </li>
      </ol>
    </nav>
  );
}
