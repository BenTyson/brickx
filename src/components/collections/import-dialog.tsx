"use client";

import { useState, useRef, useCallback } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { previewImport, commitImport } from "@/lib/actions/import";
import type { ImportPreview } from "@/lib/actions/import";

interface ImportDialogProps {
  collectionId: string;
  onSuccess?: () => void;
}

type Stage = "upload" | "preview" | "done";

export function ImportDialog({ collectionId, onSuccess }: ImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("upload");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function reset() {
    setStage("upload");
    setError(null);
    setPreview(null);
    setFile(null);
    setResult(null);
    setLoading(false);
  }

  async function processFile(f: File) {
    setFile(f);
    setError(null);
    setLoading(true);
    try {
      const text = await f.text();
      const result = await previewImport(text);
      setPreview(result);
      setStage("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setLoading(false);
    }
  }

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) await processFile(f);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  async function handleCommit() {
    if (!preview) return;
    setLoading(true);
    try {
      const res = await commitImport(preview, collectionId, file?.name ?? null);
      setResult({ imported: res.imported, skipped: res.skipped });
      setStage("done");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  const formatLabel: Record<string, string> = {
    csv: "CSV",
    bricklink_csv: "BrickLink CSV",
    bricklink_xml: "BrickLink XML",
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="mr-1.5 size-3.5" />
          Import
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import sets</DialogTitle>
        </DialogHeader>

        {stage === "upload" && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                dragging
                  ? "border-[#4C6FFF] bg-[#4C6FFF]/10"
                  : "border-border hover:border-[#4C6FFF]/50 hover:bg-[#4C6FFF]/5"
              }`}
            >
              <Upload className="mx-auto mb-3 size-6 text-muted-foreground" />
              <p className="text-sm font-medium">
                {loading ? "Parsing…" : "Drop file here or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports BrickX CSV, BrickLink CSV, BrickLink XML / .bsx
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xml,.bsx"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) processFile(f);
                }}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Supported formats:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>BrickX export CSV (set_num, condition, purchase_price…)</li>
                <li>BrickLink inventory CSV (Item No., Condition, Price…)</li>
                <li>BrickLink / BrickStock XML (.bsx)</li>
              </ul>
            </div>
          </div>
        )}

        {stage === "preview" && preview && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{file?.name}</span>
              <Badge variant="outline" className="text-xs">
                {formatLabel[preview.format] ?? preview.format}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="text-xl font-bold font-mono text-green-500">
                  {preview.matchedCount}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">matched</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="text-xl font-bold font-mono text-muted-foreground">
                  {preview.unmatchedCount}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">not found</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="text-xl font-bold font-mono">
                  {preview.rows.length}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">total rows</div>
              </div>
            </div>

            {preview.parseErrors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 space-y-1">
                <p className="text-xs font-medium text-destructive">Parse warnings</p>
                {preview.parseErrors.slice(0, 5).map((e, i) => (
                  <p key={i} className="text-xs text-muted-foreground">{e}</p>
                ))}
              </div>
            )}

            {/* Preview table — first 8 matched rows */}
            {preview.matchedCount > 0 && (
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-card">
                      <th className="py-2 px-3 text-left font-medium text-muted-foreground">Set</th>
                      <th className="py-2 px-3 text-left font-medium text-muted-foreground">Name</th>
                      <th className="py-2 px-3 text-left font-medium text-muted-foreground">Cond.</th>
                      <th className="py-2 px-3 text-right font-medium text-muted-foreground">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows
                      .filter((r) => r.matched)
                      .slice(0, 8)
                      .map((row, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="py-1.5 px-3 font-mono">{row.set_num}</td>
                          <td className="py-1.5 px-3 text-muted-foreground truncate max-w-[120px]">
                            {row.set_name}
                          </td>
                          <td className="py-1.5 px-3 capitalize">{row.condition}</td>
                          <td className="py-1.5 px-3 text-right font-mono">
                            {row.purchase_price != null ? `$${row.purchase_price.toFixed(2)}` : "—"}
                          </td>
                        </tr>
                      ))}
                    {preview.matchedCount > 8 && (
                      <tr>
                        <td colSpan={4} className="py-1.5 px-3 text-center text-muted-foreground">
                          +{preview.matchedCount - 8} more
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={reset}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleCommit}
                disabled={loading || preview.matchedCount === 0}
              >
                {loading ? "Importing…" : `Import ${preview.matchedCount} sets`}
              </Button>
            </div>
          </div>
        )}

        {stage === "done" && result && (
          <div className="space-y-4 text-center py-4">
            <div className="text-4xl font-bold font-mono text-green-500">
              {result.imported}
            </div>
            <p className="text-base font-medium">
              {result.imported === 1 ? "set imported" : "sets imported"}
            </p>
            {result.skipped > 0 && (
              <p className="text-sm text-muted-foreground">
                {result.skipped} rows skipped (sets not found in catalog)
              </p>
            )}
            <Button
              className="w-full"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
