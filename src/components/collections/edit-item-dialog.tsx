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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCollectionItem } from "@/lib/actions/collections";
import type { CollectionItem } from "@/lib/types/collection";
import type { ItemCondition } from "@/lib/types/database";

interface EditItemDialogProps {
  item: CollectionItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditItemDialog({
  item,
  open,
  onOpenChange,
}: EditItemDialogProps) {
  const [condition, setCondition] = useState<ItemCondition>(item.condition);
  const [purchasePrice, setPurchasePrice] = useState(
    item.purchase_price?.toString() ?? "",
  );
  const [purchaseDate, setPurchaseDate] = useState(item.purchase_date ?? "");
  const [notes, setNotes] = useState(item.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updateCollectionItem(item.id, {
        condition,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
        purchaseDate: purchaseDate || null,
        notes: notes || null,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update details for {item.set_name} ({item.set_id})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-condition">Condition</Label>
            <Select
              value={condition}
              onValueChange={(v) => setCondition(v as ItemCondition)}
            >
              <SelectTrigger id="edit-condition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New / Sealed</SelectItem>
                <SelectItem value="used">Used / Open</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-price">Purchase Price</Label>
            <Input
              id="edit-price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date">Purchase Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Input
              id="edit-notes"
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
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
