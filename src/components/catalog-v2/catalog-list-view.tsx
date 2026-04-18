"use client";

import Link from "next/link";
import { useMemo } from "react";
import { DataTableV2, type DataTableColumn } from "@/components/ui/data-table-v2";
import { Sparkline } from "@/components/charts/sparkline";
import { DeltaChip } from "@/components/ui/delta-chip";
import {
  sparklineForSet,
  type CatalogSet,
} from "@/lib/mock/catalog";

interface CatalogListViewProps {
  sets: CatalogSet[];
  hrefForId?: (id: string) => string;
}

const STATUS_LABEL: Record<CatalogSet["status"], string> = {
  available: "Available",
  retired: "Retired",
  "retiring-soon": "Retiring soon",
  exclusive: "Exclusive",
  unreleased: "Unreleased",
};

export function CatalogListView({
  sets,
  hrefForId = (id) => `/demo/sets/${id}`,
}: CatalogListViewProps) {
  const columns = useMemo<DataTableColumn<CatalogSet>[]>(
    () => [
      {
        key: "id",
        header: "ID",
        width: 84,
        cellClassName: "font-mono font-tabular text-text-tertiary",
        cell: (r) => r.id,
      },
      {
        key: "name",
        header: "Set",
        sort: (a, b) => a.name.localeCompare(b.name),
        cell: (r) => (
          <Link
            href={hrefForId(r.id)}
            className="text-text-primary transition hover:text-accent"
          >
            {r.name}
          </Link>
        ),
      },
      {
        key: "theme",
        header: "Theme",
        width: 140,
        sort: (a, b) => a.theme.localeCompare(b.theme),
        cell: (r) => r.theme,
      },
      {
        key: "year",
        header: "Year",
        width: 72,
        align: "right",
        sort: (a, b) => a.year - b.year,
        cellClassName: "font-mono font-tabular tabular-nums",
        cell: (r) => r.year,
      },
      {
        key: "status",
        header: "Status",
        width: 132,
        cell: (r) => (
          <span className="text-micro font-mono font-tabular uppercase tracking-[0.06em] text-text-tertiary">
            {STATUS_LABEL[r.status]}
          </span>
        ),
      },
      {
        key: "spark",
        header: "30d",
        width: 92,
        cell: (r) => (
          <Sparkline
            data={sparklineForSet(r, 30).map((p) => p.v)}
            width={72}
            height={22}
          />
        ),
      },
      {
        key: "value",
        header: "Market",
        align: "right",
        width: 108,
        sort: (a, b) => a.currentValue - b.currentValue,
        cellClassName: "font-mono font-tabular tabular-nums text-text-primary",
        cell: (r) => `$${r.currentValue.toLocaleString()}`,
      },
      {
        key: "delta",
        header: "Δ 30d",
        align: "right",
        width: 108,
        sort: (a, b) => a.pctChange30d - b.pctChange30d,
        cell: (r) => <DeltaChip value={r.pctChange30d} size="sm" hideIcon />,
      },
      {
        key: "appreciation",
        header: "Total",
        align: "right",
        width: 92,
        sort: (a, b) => a.appreciation - b.appreciation,
        cellClassName: "font-mono font-tabular tabular-nums",
        cell: (r) => `${r.appreciation > 0 ? "+" : ""}${r.appreciation.toFixed(1)}%`,
      },
    ],
    [hrefForId],
  );

  return (
    <DataTableV2
      columns={columns}
      data={sets}
      getRowKey={(r) => r.id}
      stickyOffset={0}
    />
  );
}
