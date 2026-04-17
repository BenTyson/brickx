"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type CommandItem = {
  id: string;
  title: string;
  /** Secondary line (e.g. theme + year, or "Set"). */
  subtitle?: string;
  /** Small leading image (e.g. set thumbnail). */
  imageUrl?: string;
  /** Alternative to imageUrl — an icon node. */
  icon?: ReactNode;
  /** Section this item belongs to (e.g. "Sets", "Themes"). */
  group: string;
  /** Terms prepended to fuzzy-match haystack. */
  keywords?: string[];
  /** Triggered when the user commits. */
  onSelect?: () => void;
  /** If provided, navigates to this href. */
  href?: string;
};

interface CommandPaletteProps {
  items: CommandItem[];
  /** Controlled open state. If omitted, component manages its own via cmd+K. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Placeholder in the search input. */
  placeholder?: string;
  /** Max results shown. Default 12. */
  max?: number;
}

/** Subsequence-style fuzzy match with a simple score. */
function fuzzyScore(query: string, text: string): number | null {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let score = 0;
  let qi = 0;
  let streak = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      qi++;
      streak++;
      score += 1 + streak;
      if (i === 0) score += 2;
    } else {
      streak = 0;
    }
  }
  if (qi < q.length) return null;
  score += Math.max(0, 20 - t.indexOf(q[0]));
  return score;
}

export function CommandPalette({
  items,
  open: controlledOpen,
  onOpenChange,
  placeholder,
  max,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (isControlled) onOpenChange?.(next);
      else setInternalOpen(next);
    },
    [isControlled, onOpenChange],
  );

  // cmd+K / ctrl+K toggle
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="top-[20%] w-[min(640px,calc(100vw-2rem))] translate-y-0 overflow-hidden border-border-emphasis bg-popover p-0 shadow-2xl sm:max-w-[640px]"
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">
          Search sets, themes, and minifigures. Use arrow keys to navigate,
          Enter to open.
        </DialogDescription>
        {open && (
          <PaletteContent
            items={items}
            placeholder={placeholder ?? "Search sets, themes, minifigs…"}
            max={max ?? 12}
            close={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Content body — mounted only while open so query/active state lives
 * exactly one session. No effect-sync needed; state resets naturally. */
function PaletteContent({
  items,
  placeholder,
  max,
  close,
}: {
  items: CommandItem[];
  placeholder: string;
  max: number;
  close: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return items.slice(0, max);
    }
    const scored = items
      .map((it) => {
        const haystack = [it.title, it.subtitle ?? "", ...(it.keywords ?? [])]
          .join(" ")
          .trim();
        const s = fuzzyScore(query, haystack);
        return s === null ? null : { item: it, score: s };
      })
      .filter((x): x is { item: CommandItem; score: number } => x !== null);
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, max).map((x) => x.item);
  }, [items, query, max]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const it of filtered) {
      const arr = map.get(it.group) ?? [];
      arr.push(it);
      map.set(it.group, arr);
    }
    return [...map.entries()];
  }, [filtered]);

  function commit(item: CommandItem) {
    close();
    if (item.onSelect) item.onSelect();
    else if (item.href) router.push(item.href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filtered[active];
      if (target) commit(target);
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 border-b border-border-thin px-4 py-3">
        <Search className="size-4 text-text-tertiary" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search"
          className="flex-1 bg-transparent text-small text-text-primary placeholder:text-text-tertiary focus:outline-none"
        />
        <kbd className="hidden items-center gap-1 rounded border border-border-thin bg-bg-base px-1.5 py-0.5 text-[10px] font-mono font-tabular text-text-tertiary sm:inline-flex">
          ESC
        </kbd>
      </div>

      <div className="max-h-[420px] overflow-y-auto py-2">
        {filtered.length === 0 ? (
          <div className="px-4 py-10 text-center text-small text-text-tertiary">
            No matches for &ldquo;{query}&rdquo;
          </div>
        ) : (
          grouped.map(([group, rows]) => (
            <div key={group} className="mb-1 last:mb-0">
              <div className="px-4 pb-1.5 pt-2 text-micro font-mono font-tabular uppercase tracking-[0.1em] text-text-tertiary">
                {group}
              </div>
              <ul>
                {rows.map((item) => {
                  const globalIndex = filtered.indexOf(item);
                  const isActive = globalIndex === active;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => commit(item)}
                        onMouseEnter={() => setActive(globalIndex)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-2 text-left transition",
                          isActive
                            ? "bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]"
                            : "hover:bg-bg-raised",
                        )}
                      >
                        <span
                          className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-bg-overlay"
                          aria-hidden
                        >
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt=""
                              fill
                              sizes="32px"
                              className="object-contain"
                            />
                          ) : (
                            item.icon ?? (
                              <span className="text-micro font-mono text-text-tertiary">
                                {item.title.slice(0, 1).toUpperCase()}
                              </span>
                            )
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <div className="truncate text-sm text-text-primary">
                            {item.title}
                          </div>
                          {item.subtitle && (
                            <div className="truncate text-xs text-text-tertiary">
                              {item.subtitle}
                            </div>
                          )}
                        </span>
                        <ArrowRight
                          className={cn(
                            "size-3.5 transition",
                            isActive
                              ? "text-accent"
                              : "text-transparent group-hover:text-text-tertiary",
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border-thin bg-bg-raised px-4 py-2 text-[11px] text-text-tertiary">
        <div className="flex items-center gap-3">
          <Hint keys={["↑", "↓"]} label="Navigate" />
          <Hint keys={["↵"]} label="Open" />
          <Hint keys={["esc"]} label="Close" />
        </div>
        <div className="font-mono font-tabular">BrickX · cmd+K</div>
      </div>
    </>
  );
}

function Hint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="inline-flex items-center gap-1">
      {keys.map((k) => (
        <kbd
          key={k}
          className="inline-flex h-4 min-w-[16px] items-center justify-center rounded border border-border-thin bg-bg-base px-1 text-[10px] font-mono font-tabular text-text-secondary"
        >
          {k}
        </kbd>
      ))}
      <span>{label}</span>
    </div>
  );
}
