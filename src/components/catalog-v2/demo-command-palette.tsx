"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Layers, LineChart, type LucideIcon } from "lucide-react";
import { CommandPalette, type CommandItem } from "@/components/ui/command-palette";
import { CATALOG_SETS, CATALOG_THEMES } from "@/lib/mock/catalog";

type Ctx = {
  open: () => void;
};

const DemoPaletteContext = createContext<Ctx | null>(null);

export function useDemoPalette(): Ctx {
  const ctx = useContext(DemoPaletteContext);
  if (!ctx) {
    // outside provider — safe no-op so pages rendered standalone don't crash
    return { open: () => {} };
  }
  return ctx;
}

const INDEX_ITEMS: Array<{
  id: string;
  title: string;
  subtitle: string;
  href: string;
}> = [
  {
    id: "brickx-100",
    title: "BrickX 100",
    subtitle: "Flagship index",
    href: "/demo/landing#indices",
  },
  {
    id: "star-wars-heat",
    title: "Star Wars Heat Index",
    subtitle: "Theme index",
    href: "/demo/themes/star-wars",
  },
  {
    id: "modulars",
    title: "Modulars Index",
    subtitle: "Theme index",
    href: "/demo/themes/modular",
  },
  {
    id: "retired-gold",
    title: "Retired Gold",
    subtitle: "Curated index",
    href: "/demo/landing#indices",
  },
];

const ROUTE_ITEMS: Array<{
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
}> = [
  { id: "route-sets", title: "Browse sets", subtitle: "Catalog", href: "/demo/sets", icon: Layers },
  { id: "route-themes", title: "Browse themes", subtitle: "Theme hub", href: "/demo/themes", icon: Layers },
  { id: "route-components", title: "Design primitives", subtitle: "Kitchen sink", href: "/demo/components", icon: LineChart },
  { id: "route-tokens", title: "Tokens gallery", subtitle: "Foundation", href: "/demo/tokens", icon: LineChart },
];

export function DemoCommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);

  const items = useMemo<CommandItem[]>(() => {
    const setItems: CommandItem[] = CATALOG_SETS.map((s) => ({
      id: `set-${s.id}`,
      title: s.name,
      subtitle: `${s.id} · ${s.theme} · ${s.year}`,
      group: "Sets",
      href: `/demo/sets#set-${s.id}`,
      keywords: [s.id, s.theme, String(s.year)],
    }));

    const themeItems: CommandItem[] = CATALOG_THEMES.map((t) => ({
      id: `theme-${t.slug}`,
      title: t.name,
      subtitle: `Theme · ${t.setCount} sets · +${t.avgAppreciation.toFixed(1)}% avg`,
      group: "Themes",
      href: `/demo/themes/${t.slug}`,
      keywords: [t.slug, "theme"],
    }));

    const indexItems: CommandItem[] = INDEX_ITEMS.map((i) => ({
      id: `idx-${i.id}`,
      title: i.title,
      subtitle: i.subtitle,
      group: "Indices",
      href: i.href,
    }));

    const routeItems: CommandItem[] = ROUTE_ITEMS.map((r) => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle,
      group: "Go to",
      href: r.href,
      icon: <r.icon className="size-4 text-text-tertiary" />,
    }));

    return [...routeItems, ...indexItems, ...themeItems, ...setItems];
  }, []);

  return (
    <DemoPaletteContext.Provider value={{ open }}>
      {children}
      <CommandPalette items={items} open={isOpen} onOpenChange={setIsOpen} />
    </DemoPaletteContext.Provider>
  );
}
