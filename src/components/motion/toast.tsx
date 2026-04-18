"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils/cn";
import { Check, CircleAlert, Info, TriangleAlert, X } from "lucide-react";

type Variant = "default" | "success" | "error" | "warning" | "info";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: Variant;
}

interface ToastApi {
  show: (opts: {
    title: string;
    description?: string;
    variant?: Variant;
    duration?: number;
  }) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const variantStyles: Record<
  Variant,
  { icon: ReactNode; ring: string }
> = {
  default: {
    icon: <Info className="size-4 text-text-secondary" />,
    ring: "border-border-emphasis",
  },
  success: {
    icon: <Check className="size-4 text-[var(--success)]" />,
    ring: "border-[color:var(--success)]/40",
  },
  error: {
    icon: <CircleAlert className="size-4 text-[var(--danger)]" />,
    ring: "border-[color:var(--danger)]/40",
  },
  warning: {
    icon: <TriangleAlert className="size-4 text-[var(--warning)]" />,
    ring: "border-[color:var(--warning)]/40",
  },
  info: {
    icon: <Info className="size-4 text-accent" />,
    ring: "border-accent/40",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const reduceMotion = useReducedMotion();

  const dismiss = useCallback((id: number) => {
    setItems((curr) => curr.filter((t) => t.id !== id));
  }, []);

  const show = useCallback<ToastApi["show"]>(
    ({ title, description, variant = "default", duration = 4200 }) => {
      const id = nextId.current++;
      setItems((curr) => [...curr, { id, title, description, variant }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const api = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4 sm:inset-auto sm:right-4 sm:bottom-4 sm:items-end"
      >
        <AnimatePresence initial={false}>
          {items.map((t) => {
            const style = variantStyles[t.variant];
            return (
              <motion.div
                key={t.id}
                layout
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 24, scale: 0.96 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 8, scale: 0.98 }
                }
                transition={{ type: "spring", stiffness: 360, damping: 30 }}
                className={cn(
                  "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-bg-raised/95 px-4 py-3 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] backdrop-blur supports-[backdrop-filter]:bg-bg-raised/80",
                  style.ring,
                )}
              >
                <div className="mt-0.5">{style.icon}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {t.title}
                  </p>
                  {t.description && (
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {t.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => dismiss(t.id)}
                  className="rounded p-0.5 text-text-tertiary transition-colors hover:text-text-primary"
                >
                  <X className="size-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
