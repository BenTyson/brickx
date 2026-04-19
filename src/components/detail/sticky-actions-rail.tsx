"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, BookmarkPlus } from "lucide-react";
import { AddToCollectionDialog } from "@/components/detail/add-to-collection-dialog";
import { CreateAlertDialog } from "@/components/alerts/create-alert-dialog";
import { ShareButton } from "./share-button";
import { cn } from "@/lib/utils/cn";

interface StickyActionsRailProps {
  setId: string;
  setName: string;
  marketValue: number;
  delta30d: number;
  userId: string | null;
}

/**
 * Sticky right rail on desktop (lg+); fixed bottom bar on mobile.
 * Wires to real add-to-collection / create-alert flows.
 */
export function StickyActionsRail(props: StickyActionsRailProps) {
  return (
    <>
      <aside className="hidden lg:sticky lg:top-24 lg:block">
        <RailContent {...props} />
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-emphasis bg-bg-base/95 px-4 py-3 backdrop-blur lg:hidden">
        <MobileActions {...props} />
      </div>
    </>
  );
}

function RailContent({
  setId,
  setName,
  marketValue,
  delta30d,
  userId,
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

      <AddToCollectionAction
        setId={setId}
        setName={setName}
        userId={userId}
      />
      <CreateAlertAction setId={setId} setName={setName} userId={userId} />

      <div className="rounded-xl border border-border-thin bg-bg-raised p-3">
        <div className="text-[10px] font-mono font-tabular uppercase tracking-[0.06em] text-text-quaternary">
          Quick stats
        </div>
        <div className="mt-2 space-y-1 text-small">
          <div className="flex items-center justify-between font-mono font-tabular tabular-nums">
            <span className="text-text-tertiary">Market value</span>
            <span className="text-text-primary">
              {marketValue > 0 ? `$${marketValue.toFixed(0)}` : "—"}
            </span>
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
  userId,
}: StickyActionsRailProps) {
  return (
    <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
      <AddToCollectionAction
        setId={setId}
        setName={setName}
        userId={userId}
        compact
      />
      <CreateAlertAction
        setId={setId}
        setName={setName}
        userId={userId}
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
  setId,
  setName,
  userId,
  compact,
}: {
  setId: string;
  setName: string;
  userId: string | null;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const baseCls =
    "inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-small font-medium transition bg-brand-gradient text-accent-foreground shadow-[0_8px_28px_-12px_color-mix(in_oklab,var(--accent)_60%,transparent)] hover:brightness-110";
  const compactCls = "px-3 py-2 text-[12px]";

  if (!userId) {
    return (
      <Link
        href={`/sign-in?next=/sets/${setId}`}
        className={cn(baseCls, compact && compactCls)}
      >
        <BookmarkPlus className="size-4" strokeWidth={2.2} />
        {compact ? "Save" : "Sign in to save"}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Add ${setName} to a collection`}
        className={cn(baseCls, compact && compactCls)}
      >
        <BookmarkPlus className="size-4" strokeWidth={2.2} />
        {compact ? "Save" : "Add to collection"}
      </button>
      <AddToCollectionDialog
        setId={setId}
        setName={setName}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

function CreateAlertAction({
  setId,
  setName,
  userId,
  compact,
}: {
  setId: string;
  setName: string;
  userId: string | null;
  compact?: boolean;
}) {
  const baseCls =
    "inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-small transition border-border-emphasis bg-bg-raised text-text-secondary hover:text-text-primary";
  const compactCls = "px-3 py-2 text-[12px]";

  if (!userId) {
    return (
      <Link
        href={`/sign-in?next=/sets/${setId}`}
        className={cn(baseCls, compact && compactCls)}
      >
        <Bell className="size-4" strokeWidth={2.2} />
        {compact ? "Alert" : "Sign in for alerts"}
      </Link>
    );
  }

  return (
    <div className={compact ? "inline-flex w-full" : "block w-full"}>
      <CreateAlertDialog
        setId={setId}
        setName={setName}
        triggerClassName={cn(baseCls, compact && compactCls)}
        triggerLabel={
          <>
            <Bell className="size-4" strokeWidth={2.2} />
            {compact ? "Alert" : "Create price alert"}
          </>
        }
      />
    </div>
  );
}
