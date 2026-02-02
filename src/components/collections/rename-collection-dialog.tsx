"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { renameCollection } from "@/lib/actions/collections";
import type { CollectionSummary } from "@/lib/types/collection";

interface RenameCollectionDialogProps {
  collection: CollectionSummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenameCollectionDialog({
  collection,
  open,
  onOpenChange,
}: RenameCollectionDialogProps) {
  const [name, setName] = useState(collection.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRename(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setError("");
    setLoading(true);

    try {
      await renameCollection(collection.id, name);
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to rename collection",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Collection</DialogTitle>
          <DialogDescription>
            Enter a new name for this collection.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRename}>
          <div className="space-y-2 py-4">
            <Label htmlFor="rename-collection">Name</Label>
            <Input
              id="rename-collection"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
            {error && (
              <p className="text-destructive text-sm" role="alert">
                {error}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading && <Loader2 className="animate-spin" />}
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
