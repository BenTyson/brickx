"use client";

import { useState } from "react";
import { Check, Link2, Share2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface ShareButtonProps {
  setId: string;
  setName: string;
  marketValue: number;
  delta30d: number;
  variant?: "ghost" | "outline";
  className?: string;
}

const SHARE_TARGETS = [
  { id: "twitter", label: "X / Twitter", host: "https://x.com/intent/tweet" },
  { id: "reddit", label: "Reddit", host: "https://www.reddit.com/submit" },
  { id: "linkedin", label: "LinkedIn", host: "https://www.linkedin.com/sharing/share-offsite" },
];

export function ShareButton({
  setId,
  setName,
  marketValue,
  delta30d,
  variant = "outline",
  className,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/sets/${setId}`
      : `https://brickx.io/sets/${setId}`;
  const text = `${setName} · $${marketValue.toFixed(0)} (${delta30d >= 0 ? "+" : ""}${delta30d.toFixed(1)}% 30d) on BrickX`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  function shareUrlFor(target: (typeof SHARE_TARGETS)[number]) {
    const params = new URLSearchParams();
    if (target.id === "twitter") {
      params.set("text", text);
      params.set("url", url);
    } else if (target.id === "reddit") {
      params.set("title", text);
      params.set("url", url);
    } else {
      params.set("url", url);
    }
    return `${target.host}?${params.toString()}`;
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-small transition",
          variant === "outline"
            ? "border border-border-emphasis bg-bg-raised text-text-secondary hover:text-text-primary"
            : "text-text-tertiary hover:text-text-primary",
        )}
      >
        <Share2 className="size-4" strokeWidth={2.2} />
        Share
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 z-30 mt-2 w-72 origin-top-right rounded-2xl border border-border-emphasis bg-popover p-3 shadow-xl"
          >
            <div className="flex items-center justify-between px-2 pb-2">
              <span className="text-micro font-mono font-tabular text-text-tertiary">
                Share this set
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-text-tertiary transition hover:text-text-primary"
                aria-label="Close share menu"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="rounded-xl bg-bg-raised p-3">
              <div className="text-[10px] font-mono font-tabular uppercase tracking-[0.06em] text-text-quaternary">
                Preview
              </div>
              <p className="mt-1 line-clamp-2 text-small text-text-primary">
                {text}
              </p>
            </div>
            <ul className="mt-2 grid gap-1">
              {SHARE_TARGETS.map((t) => (
                <li key={t.id}>
                  <a
                    href={shareUrlFor(t)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-small text-text-secondary transition hover:bg-bg-raised hover:text-text-primary"
                  >
                    {t.label}
                    <span className="text-[10px] font-mono font-tabular uppercase tracking-[0.06em] text-text-quaternary">
                      open
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={copy}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-small text-text-secondary transition hover:bg-bg-raised hover:text-text-primary"
                >
                  <span className="inline-flex items-center gap-2">
                    {copied ? (
                      <>
                        <Check className="size-3.5 text-success" />
                        Link copied
                      </>
                    ) : (
                      <>
                        <Link2 className="size-3.5" />
                        Copy link
                      </>
                    )}
                  </span>
                  <span className="text-[10px] font-mono font-tabular uppercase tracking-[0.06em] text-text-quaternary">
                    {copied ? "ok" : "/sets/" + setId}
                  </span>
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
