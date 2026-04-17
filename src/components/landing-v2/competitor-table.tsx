"use client";

import { Check, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ScrollReveal } from "@/components/motion";

type Cell = true | false | "partial";

type Row = {
  feature: string;
  brickx: Cell;
  brickeconomy: Cell;
  brickvault: Cell;
  spreadsheet: Cell;
};

const rows: Row[] = [
  { feature: "Blended price engine (BrickLink + BrickOwl + BrickEconomy)", brickx: true, brickeconomy: "partial", brickvault: false, spreadsheet: false },
  { feature: "Named indices (BrickX 100, theme heat)", brickx: true, brickeconomy: false, brickvault: false, spreadsheet: false },
  { feature: "Portfolio tracking with cost basis", brickx: true, brickeconomy: true, brickvault: true, spreadsheet: "partial" },
  { feature: "Historical portfolio value chart", brickx: true, brickeconomy: false, brickvault: "partial", spreadsheet: false },
  { feature: "Price alerts (email + in-app)", brickx: true, brickeconomy: "partial", brickvault: false, spreadsheet: false },
  { feature: "Retirement intelligence with risk score", brickx: true, brickeconomy: "partial", brickvault: false, spreadsheet: false },
  { feature: "Bulk CSV import / export", brickx: true, brickeconomy: true, brickvault: false, spreadsheet: true },
  { feature: "Command-palette search (⌘K)", brickx: true, brickeconomy: false, brickvault: false, spreadsheet: false },
  { feature: "Modern, mobile-first UI", brickx: true, brickeconomy: false, brickvault: false, spreadsheet: false },
];

export function CompetitorTable() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 lg:px-14">
      <ScrollReveal>
        <div className="text-micro font-mono font-tabular text-text-tertiary">
          04 · Comparison
        </div>
        <h2 className="mt-4 max-w-[720px] text-h2 font-serif-display italic text-text-primary">
          BrickX vs. the way it&rsquo;s been done.
        </h2>
        <p className="mt-4 max-w-[580px] text-body text-text-secondary">
          BrickEconomy and BrickVault are the incumbents. Spreadsheets are the
          fallback. Here&rsquo;s what each one actually does.
        </p>
      </ScrollReveal>

      <div className="mt-12 overflow-hidden rounded-xl border border-border-thin bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border-thin">
                <th className="px-5 py-4 text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
                  Feature
                </th>
                <th className="px-5 py-4 text-center">
                  <span className="text-small font-medium text-accent">BrickX</span>
                </th>
                <Th>BrickEconomy</Th>
                <Th>BrickVault</Th>
                <Th>Spreadsheet</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.feature}
                  className={cn(
                    "border-b border-border-thin last:border-b-0 transition",
                    "hover:bg-bg-raised/60",
                  )}
                >
                  <td className="px-5 py-4 text-small text-text-primary">
                    {r.feature}
                  </td>
                  <Td cell={r.brickx} primary />
                  <Td cell={r.brickeconomy} />
                  <Td cell={r.brickvault} />
                  <Td cell={r.spreadsheet} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-4 text-center text-micro font-mono font-tabular uppercase tracking-[0.08em] text-text-tertiary">
      {children}
    </th>
  );
}

function Td({ cell, primary }: { cell: Cell; primary?: boolean }) {
  return (
    <td className="px-5 py-4 text-center">
      {cell === true && (
        <Check
          className={cn(
            "mx-auto size-4",
            primary ? "text-accent" : "text-success",
          )}
          strokeWidth={2.5}
        />
      )}
      {cell === false && (
        <X className="mx-auto size-4 text-text-quaternary" strokeWidth={2} />
      )}
      {cell === "partial" && (
        <Minus className="mx-auto size-4 text-warning" strokeWidth={2.5} />
      )}
    </td>
  );
}
