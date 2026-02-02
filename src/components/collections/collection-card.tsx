"use client";

import Link from "next/link";
import { FolderOpen, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RenameCollectionDialog } from "@/components/collections/rename-collection-dialog";
import { DeleteCollectionDialog } from "@/components/collections/delete-collection-dialog";
import type { CollectionSummary } from "@/lib/types/collection";
import { useState } from "react";

interface CollectionCardProps {
  collection: CollectionSummary;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Card className="group hover:border-primary/50 relative transition-colors">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <Link
            href={`/collections/${collection.id}`}
            className="flex items-center gap-3 after:absolute after:inset-0"
          >
            <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
              <FolderOpen className="text-primary size-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-base">
                {collection.name}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {collection.item_count}{" "}
                {collection.item_count === 1 ? "set" : "sets"}
              </p>
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="relative z-10 opacity-0 group-hover:opacity-100"
                aria-label="Collection actions"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            Created{" "}
            {new Date(collection.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </CardContent>
      </Card>

      <RenameCollectionDialog
        collection={collection}
        open={renameOpen}
        onOpenChange={setRenameOpen}
      />
      <DeleteCollectionDialog
        collection={collection}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
