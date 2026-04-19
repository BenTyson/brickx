"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  linkForPage: (page: number) => string;
}

export function CatalogPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  linkForPage,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalCount);
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="mt-6 flex flex-col items-center gap-4 border-t border-border-thin pt-6">
      <p className="text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
        Showing {from.toLocaleString()}–{to.toLocaleString()} of{" "}
        {totalCount.toLocaleString()}
      </p>
      <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
        <StepLink
          href={linkForPage(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          label="Previous page"
        >
          <ChevronLeft className="size-4" strokeWidth={2} />
          <span className="hidden sm:inline">Prev</span>
        </StepLink>
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`ell-${i}`}
              className="px-2 text-text-quaternary"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <PageLink
              key={p}
              href={linkForPage(p)}
              active={p === currentPage}
            >
              {p}
            </PageLink>
          ),
        )}
        <StepLink
          href={linkForPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" strokeWidth={2} />
        </StepLink>
      </nav>
    </div>
  );
}

function PageLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md border text-small font-mono font-tabular tabular-nums transition",
        active
          ? "border-border-emphasis bg-bg-overlay text-text-primary"
          : "border-border-thin bg-bg-raised text-text-secondary hover:border-border-emphasis hover:text-text-primary",
      )}
    >
      {children}
    </Link>
  );
}

function StepLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const base =
    "inline-flex h-9 items-center gap-1 rounded-md border border-border-thin bg-bg-raised px-3 text-small text-text-secondary transition";
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(base, "cursor-not-allowed opacity-40")}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      scroll={false}
      className={cn(base, "hover:border-border-emphasis hover:text-text-primary")}
    >
      {children}
    </Link>
  );
}

function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}
