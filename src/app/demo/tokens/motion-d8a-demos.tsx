"use client";

import { useState } from "react";
import { Check, Loader2, Plus, Sparkles } from "lucide-react";
import { Crossfade, NavLinkUnderline, Press, useToast } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

/**
 * Interactive playground for the D8a motion additions:
 * page transition (global), press, nav underline, toast, crossfade.
 */
export function MotionD8aDemos() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Card label="<Press>">
        <div className="flex flex-wrap items-center gap-3">
          <Press className="inline-flex">
            <Button>Primary press</Button>
          </Press>
          <Press className="inline-flex">
            <Button variant="outline">Outline press</Button>
          </Press>
          <Press className="inline-flex">
            <Button variant="ghost" size="sm">
              <Plus /> New alert
            </Button>
          </Press>
        </div>
        <p className="text-small text-text-tertiary mt-4">
          Tap / click to see the spring release. Shadcn buttons also get{" "}
          <code className="font-mono">active:scale-[0.98]</code> at the CSS layer.
        </p>
      </Card>

      <Card label="useToast()">
        <ToastDemo />
      </Card>

      <Card label="<NavLinkUnderline>">
        <NavUnderlineDemo />
      </Card>

      <Card label="<Crossfade>">
        <CrossfadeDemo />
      </Card>
    </div>
  );
}

function Card({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-bg-raised p-6">
      <div className="text-micro font-mono font-tabular text-text-tertiary mb-6">
        {label}
      </div>
      {children}
    </div>
  );
}

function ToastDemo() {
  const { show } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          show({
            title: "Saved to Modulars",
            description: "10297 Boutique Hotel added to your collection.",
            variant: "success",
          })
        }
      >
        <Check /> Success
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          show({
            title: "Alert triggered",
            description: "Imperial Flagship crossed $2,800.",
            variant: "info",
          })
        }
      >
        <Sparkles /> Info
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          show({
            title: "Price refresh failed",
            description: "BrickLink returned 502. Will retry in 5 min.",
            variant: "error",
            duration: 6000,
          })
        }
      >
        Error
      </Button>
    </div>
  );
}

function NavUnderlineDemo() {
  const links = [
    { href: "#overview", label: "Overview" },
    { href: "#history", label: "History" },
    { href: "#events", label: "Events" },
    { href: "#related", label: "Related" },
  ];
  const [active, setActive] = useState(links[0].href);
  return (
    <div>
      <nav className="flex items-center gap-5 border-b border-border-thin">
        {links.map((l) => (
          <button
            key={l.href}
            type="button"
            onClick={() => setActive(l.href)}
            className="contents"
          >
            <NavLinkUnderline
              href={l.href}
              active={active === l.href}
              layoutGroupId="tokens-demo-nav"
            >
              {l.label}
            </NavLinkUnderline>
          </button>
        ))}
      </nav>
      <p className="text-small text-text-tertiary mt-4">
        The underline shares a <code className="font-mono">layoutId</code> across
        siblings — clicking a tab slides it to the new target.
      </p>
    </div>
  );
}

function CrossfadeDemo() {
  const [ready, setReady] = useState(false);
  return (
    <div>
      <Crossfade
        ready={ready}
        skeleton={
          <div className="flex items-center gap-3 rounded-md bg-bg-overlay p-4">
            <Loader2 className="size-4 animate-spin text-text-tertiary" />
            <div className="flex flex-col gap-2">
              <span className="skeleton-shimmer h-3 w-40 rounded" />
              <span className="skeleton-shimmer h-3 w-24 rounded" />
            </div>
          </div>
        }
      >
        <div
          className={cn(
            "rounded-md bg-bg-overlay p-4 text-small text-text-primary",
          )}
        >
          <div className="font-medium">10297 Boutique Hotel</div>
          <div className="text-text-tertiary mt-0.5 font-mono font-tabular text-micro">
            $274.00 · +11.2% (30d)
          </div>
        </div>
      </Crossfade>
      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setReady((r) => !r)}
        >
          Toggle ready
        </Button>
        <span className="text-small text-text-tertiary">
          state: {ready ? "content" : "skeleton"}
        </span>
      </div>
    </div>
  );
}
