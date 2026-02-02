"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { href: "/sets", label: "Browse" },
  { href: "#trending", label: "Trending" },
  { href: "#pricing", label: "Pricing" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
          className="min-h-11 min-w-11"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>
            <Logo variant="full" />
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <nav
          className="flex flex-col gap-1 px-4"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              className="justify-start"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
        <Separator />
        <div className="flex flex-col gap-2 px-4">
          <Button variant="outline" asChild onClick={() => setOpen(false)}>
            <Link href="#">Sign In</Link>
          </Button>
          <Button asChild onClick={() => setOpen(false)}>
            <Link href="#">Get Started</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
