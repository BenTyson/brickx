"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addItemToCollection,
  createCollection,
} from "@/lib/actions/collections";
import { createClient } from "@/lib/supabase/client";
import type { ItemCondition } from "@/lib/types/database";

interface AddToCollectionDialogProps {
  setId: string;
  setName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CollectionOption {
  id: string;
  name: string;
}

export function AddToCollectionDialog({
  setId,
  setName,
  open,
  onOpenChange,
}: AddToCollectionDialogProps) {
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [condition, setCondition] = useState<ItemCondition>("new");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingCollections, setFetchingCollections] = useState(false);
  const [error, setError] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewCollection, setShowNewCollection] = useState(false);

  // Fetch collections client-side when dialog opens
  useEffect(() => {
    if (!open) return;

    async function loadCollections() {
      setFetchingCollections(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("collections")
        .select("id, name")
        .order("created_at", { ascending: false });

      if (data) {
        setCollections(data);
        if (data.length > 0 && !selectedCollectionId) {
          setSelectedCollectionId(data[0].id);
        }
      }
      setFetchingCollections(false);
    }

    loadCollections();
  }, [open, selectedCollectionId]);

  async function handleCreateNewCollection() {
    if (!newCollectionName.trim()) return;
    setLoading(true);

    try {
      const result = await createCollection(newCollectionName);
      setCollections((prev) => [
        { id: result.id, name: newCollectionName.trim() },
        ...prev,
      ]);
      setSelectedCollectionId(result.id);
      setShowNewCollection(false);
      setNewCollectionName("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create collection",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCollectionId) return;

    setError("");
    setLoading(true);

    try {
      await addItemToCollection({
        collectionId: selectedCollectionId,
        setId,
        condition,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
        purchaseDate: purchaseDate || null,
        notes: notes || null,
      });
      // Reset form
      setPurchasePrice("");
      setPurchaseDate("");
      setNotes("");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          <DialogDescription>
            Add {setName} ({setId}) to one of your collections.
          </DialogDescription>
        </DialogHeader>

        {fetchingCollections ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="text-muted-foreground size-6 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Collection picker */}
            <div className="space-y-2">
              <Label>Collection</Label>
              {showNewCollection ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Collection name"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    autoFocus
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateNewCollection}
                    disabled={loading || !newCollectionName.trim()}
                  >
                    Create
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowNewCollection(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Select
                    value={selectedCollectionId}
                    onValueChange={setSelectedCollectionId}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a collection" />
                    </SelectTrigger>
                    <SelectContent>
                      {collections.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowNewCollection(true)}
                    aria-label="Create new collection"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <Label htmlFor="add-condition">Condition</Label>
              <Select
                value={condition}
                onValueChange={(v) => setCondition(v as ItemCondition)}
              >
                <SelectTrigger id="add-condition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New / Sealed</SelectItem>
                  <SelectItem value="used">Used / Open</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Purchase price */}
            <div className="space-y-2">
              <Label htmlFor="add-price">Purchase Price</Label>
              <Input
                id="add-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
              />
            </div>

            {/* Purchase date */}
            <div className="space-y-2">
              <Label htmlFor="add-date">Purchase Date</Label>
              <Input
                id="add-date"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="add-notes">Notes</Label>
              <Input
                id="add-notes"
                placeholder="Optional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-destructive text-sm" role="alert">
                {error}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !selectedCollectionId}>
                {loading && <Loader2 className="animate-spin" />}
                Add to Collection
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
