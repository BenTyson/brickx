"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPriceAlert } from "@/lib/actions/alerts";
import type { AlertType } from "@/lib/types/database";

interface CreateAlertDialogProps {
  setId: string;
  setName: string;
}

export function CreateAlertDialog({ setId, setName }: CreateAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("price_drop");
  const [targetPrice, setTargetPrice] = useState("");
  const [thresholdPct, setThresholdPct] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createPriceAlert({
        setId,
        alertType,
        targetPrice: targetPrice ? parseFloat(targetPrice) : null,
        thresholdPct: thresholdPct ? parseFloat(thresholdPct) : null,
      });
      setOpen(false);
      setTargetPrice("");
      setThresholdPct("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bell className="size-4" />
          Set Alert
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Price Alert</DialogTitle>
          <DialogDescription>
            Get notified about price changes for {setName}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alertType">Alert Type</Label>
            <Select
              value={alertType}
              onValueChange={(v) => setAlertType(v as AlertType)}
            >
              <SelectTrigger id="alertType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_drop">Price Drop</SelectItem>
                <SelectItem value="price_target">Price Target</SelectItem>
                <SelectItem value="value_exceeded">Value Exceeded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {alertType === "price_target" && (
            <div className="space-y-2">
              <Label htmlFor="targetPrice">Target Price ($)</Label>
              <Input
                id="targetPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 150.00"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
              />
            </div>
          )}

          {alertType === "price_drop" && (
            <div className="space-y-2">
              <Label htmlFor="thresholdPct">Drop Threshold (%)</Label>
              <Input
                id="thresholdPct"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="e.g. 10"
                value={thresholdPct}
                onChange={(e) => setThresholdPct(e.target.value)}
              />
            </div>
          )}

          {alertType === "value_exceeded" && (
            <div className="space-y-2">
              <Label htmlFor="targetPriceExceed">Value Threshold ($)</Label>
              <Input
                id="targetPriceExceed"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 200.00"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
              />
            </div>
          )}

          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Alert"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
