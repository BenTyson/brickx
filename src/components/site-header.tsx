"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { UserMenu } from "@/components/auth/user-menu";
import { NotificationBell } from "@/components/alerts/notification-bell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/sets", label: "Browse" },
  { href: "/market", label: "Market" },
  { href: "/collections", label: "Collections" },
  { href: "/portfolio", label: "Portfolio" },
];

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur",
        className,
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-6">
          <Logo variant="full" className="hidden md:flex" />
          <Logo variant="icon" className="flex md:hidden" />
          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Button key={link.href} variant="ghost" size="sm" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <NotificationBell />
            <UserMenu />
          </div>
          {/* Mobile hamburger */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>
  );
}
