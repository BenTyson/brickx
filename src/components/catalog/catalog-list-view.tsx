"use client";

import Link from "next/link";
import { useMemo } from "react";
import { DataTableV2, type DataTableColumn } from "@/components/ui/data-table-v2";
import { DeltaChip } from "@/components/ui/delta-chip";
import type { SetStatus } from "@/lib/types/database";
import type { CatalogSetView } from "@/lib/view-models/catalog";

interface CatalogListViewProps {
  sets: CatalogSetView[];
  hrefForId?: (id: string) => string;
}

const STATUS_LABEL: Record<SetStatus, string> = {
  available: "Available",
  retired: "Retired",
  unreleased: "Unreleased",
};

export function CatalogListView({
  sets,
  hrefForId = (id) => `/sets/${id}`,
}: CatalogListViewProps) {
  const columns = useMemo<DataTableColumn<CatalogSetView>[]>(
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
        width: 160,
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
        width: 120,
        cell: (r) => (
          <span className="text-micro font-mono font-tabular uppercase tracking-[0.06em] text-text-tertiary">
            {STATUS_LABEL[r.status]}
          </span>
        ),
      },
      {
        key: "msrp",
        header: "MSRP",
        align: "right",
        width: 96,
        sort: (a, b) => a.msrp - b.msrp,
        cellClassName: "font-mono font-tabular tabular-nums text-text-tertiary",
        cell: (r) => (r.msrp > 0 ? `$${r.msrp.toFixed(0)}` : "—"),
      },
      {
        key: "value",
        header: "Market",
        align: "right",
        width: 108,
        sort: (a, b) => a.currentValue - b.currentValue,
        cellClassName: "font-mono font-tabular tabular-nums text-text-primary",
        cell: (r) =>
          r.currentValue > 0 ? `$${r.currentValue.toLocaleString()}` : "—",
      },
      {
        key: "delta",
        header: "Δ 30d",
        align: "right",
        width: 108,
        sort: (a, b) => a.pctChange30d - b.pctChange30d,
        cell: (r) => <DeltaChip value={r.pctChange30d} size="sm" hideIcon />,
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
