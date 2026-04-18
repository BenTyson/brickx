"use client";

import { useState } from "react";
import { Bell, BookmarkPlus, Check } from "lucide-react";
import { ShareButton } from "./share-button";
import { cn } from "@/lib/utils/cn";

interface StickyActionsRailProps {
  setId: string;
  setName: string;
  marketValue: number;
  delta30d: number;
}

/**
 * Sticky right rail on desktop (lg+); fixed bottom bar on mobile.
 * Hooks are stubbed since this is a demo — but the shapes match what the
 * production page will eventually wire up (collection + alert flows).
 */
export function StickyActionsRail({
  setId,
  setName,
  marketValue,
  delta30d,
}: StickyActionsRailProps) {
  return (
    <>
      <aside className="hidden lg:sticky lg:top-24 lg:block">
        <RailContent
          setId={setId}
          setName={setName}
          marketValue={marketValue}
          delta30d={delta30d}
        />
      </aside>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-emphasis bg-bg-base/95 px-4 py-3 backdrop-blur lg:hidden">
        <MobileActions
          setId={setId}
          setName={setName}
          marketValue={marketValue}
          delta30d={delta30d}
        />
      </div>
    </>
  );
}

function RailContent({
  setId,
  setName,
  marketValue,
  delta30d,
}: StickyActionsRailProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-border-thin bg-card p-5">
      <div>
        <div className="text-micro font-mono font-tabular tracking-[0.08em] text-text-tertiary">
          Take action
        </div>
        <p className="mt-2 text-small text-text-secondary">
          Track this set in your portfolio or get notified when it crosses a
          target.
        </p>
      </div>

      <AddToCollectionAction setName={setName} />
      <CreateAlertAction setName={setName} marketValue={marketValue} />

      <div className="rounded-xl border border-border-thin bg-bg-raised p-3">
        <div className="text-[10px] font-mono font-tabular uppercase tracking-[0.06em] text-text-quaternary">
          Quick stats
        </div>
        <div className="mt-2 space-y-1 text-small">
          <div className="flex items-center justify-between font-mono font-tabular tabular-nums">
            <span className="text-text-tertiary">Market value</span>
            <span className="text-text-primary">${marketValue.toFixed(0)}</span>
          </div>
          <div className="flex items-center justify-between font-mono font-tabular tabular-nums">
            <span className="text-text-tertiary">30d change</span>
            <span
              className={cn(delta30d >= 0 ? "text-success" : "text-danger")}
            >
              {delta30d >= 0 ? "+" : ""}
              {delta30d.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <ShareButton
        setId={setId}
        setName={setName}
        marketValue={marketValue}
        delta30d={delta30d}
      />
    </div>
  );
}

function MobileActions({
  setId,
  setName,
  marketValue,
  delta30d,
}: StickyActionsRailProps) {
  return (
    <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
      <AddToCollectionAction setName={setName} compact />
      <CreateAlertAction
        setName={setName}
        marketValue={marketValue}
        compact
      />
      <div className="self-center">
        <ShareButton
          setId={setId}
          setName={setName}
          marketValue={marketValue}
          delta30d={delta30d}
          variant="ghost"
        />
      </div>
    </div>
  );
}

function AddToCollectionAction({
  setName,
  compact,
}: {
  setName: string;
  compact?: boolean;
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setDone((d) => !d)}
      aria-label={`Add ${setName} to collection`}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-small font-medium transition",
        done
          ? "bg-bg-overlay text-success ring-1 ring-inset ring-[color-mix(in_oklab,var(--success)_30%,transparent)]"
          : "bg-brand-gradient text-accent-foreground shadow-[0_8px_28px_-12px_color-mix(in_oklab,var(--accent)_60%,transparent)] hover:brightness-110",
        compact && "px-3 py-2 text-[12px]",
      )}
    >
      {done ? (
        <>
          <Check className="size-4" strokeWidth={2.4} />
          {compact ? "Saved" : "Added to collection"}
        </>
      ) : (
        <>
          <BookmarkPlus className="size-4" strokeWidth={2.2} />
          {compact ? "Save" : "Add to collection"}
        </>
      )}
    </button>
  );
}

function CreateAlertAction({
  setName,
  marketValue,
  compact,
}: {
  setName: string;
  marketValue: number;
  compact?: boolean;
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setDone((d) => !d)}
      aria-label={`Create price alert for ${setName}`}
      title={`Default trigger: $${(marketValue * 0.9).toFixed(0)} (-10%)`}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-small transition",
        done
          ? "border-[color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-accent"
          : "border-border-emphasis bg-bg-raised text-text-secondary hover:text-text-primary",
        compact && "px-3 py-2 text-[12px]",
      )}
    >
      <Bell className="size-4" strokeWidth={2.2} />
      {done
        ? compact
          ? "Watching"
          : "Alert active"
        : compact
          ? "Alert"
          : "Create price alert"}
    </button>
  );
}
