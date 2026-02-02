"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditItemDialog } from "@/components/collections/edit-item-dialog";
import { removeCollectionItem } from "@/lib/actions/collections";
import type { CollectionItem } from "@/lib/types/collection";

interface CollectionItemsTableProps {
  items: CollectionItem[];
}

export function CollectionItemsTable({ items }: CollectionItemsTableProps) {
  const [editItem, setEditItem] = useState<CollectionItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <Package className="text-muted-foreground/50 mb-4 size-12" />
        <h2 className="text-lg font-semibold">No sets in this collection</h2>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          Browse the catalog and add sets to this collection.
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/sets">Browse Sets</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="px-4 py-3 text-left font-medium">Set</th>
              <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">
                Condition
              </th>
              <th className="hidden px-4 py-3 text-right font-medium md:table-cell">
                Purchase Price
              </th>
              <th className="px-4 py-3 text-right font-medium">
                Current Value
              </th>
              <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">
                Gain/Loss
              </th>
              <th className="w-10 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const currentValue =
                item.condition === "new"
                  ? (item.market_value_new ?? 0)
                  : (item.market_value_used ?? 0);
              const gainLoss =
                item.purchase_price != null
                  ? currentValue - item.purchase_price
                  : null;

              return (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded">
                        {item.set_img_url ? (
                          <Image
                            src={item.set_img_url}
                            alt={item.set_name}
                            fill
                            sizes="40px"
                            className="object-contain"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <Package className="text-muted-foreground size-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/sets/${item.set_id}`}
                          className="hover:text-primary truncate font-medium transition-colors"
                        >
                          {item.set_name}
                        </Link>
                        <p className="text-muted-foreground text-xs">
                          {item.set_id}
                          {item.theme_name && ` · ${item.theme_name}`}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <Badge variant="secondary" className="capitalize">
                      {item.condition}
                    </Badge>
                  </td>
                  <td className="hidden px-4 py-3 text-right md:table-cell">
                    {item.purchase_price != null
                      ? `$${item.purchase_price.toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {currentValue > 0 ? `$${currentValue.toFixed(2)}` : "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-right sm:table-cell">
                    {gainLoss != null ? (
                      <span
                        className={
                          gainLoss >= 0 ? "text-success" : "text-destructive"
                        }
                      >
                        {gainLoss >= 0 ? "+" : ""}${gainLoss.toFixed(2)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-2 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Item actions"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setEditItem(item)}>
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => removeCollectionItem(item.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="size-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editItem && (
        <EditItemDialog
          item={editItem}
          open={!!editItem}
          onOpenChange={(open) => {
            if (!open) setEditItem(null);
          }}
        />
      )}
    </>
  );
}
