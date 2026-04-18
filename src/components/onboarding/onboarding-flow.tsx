"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { markOnboarded, previewImport, commitImport } from "@/lib/actions/import";
import { updateNotificationPreferences } from "@/lib/actions/alerts";
import { createCollection } from "@/lib/actions/collections";
import type { ImportPreview } from "@/lib/actions/import";
import type { CollectionSummary } from "@/lib/types/collection";

interface OnboardingFlowProps {
  userName: string;
  collections: CollectionSummary[];
}

type Step = "welcome" | "import" | "alerts";

export function OnboardingFlow({ userName, collections }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [loading, setLoading] = useState(false);

  // Import state
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importDone, setImportDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Alerts state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);
  const [valueExceededAlerts, setValueExceededAlerts] = useState(true);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    setImportError(null);
    setPreview(null);
    setLoading(true);
    try {
      const text = await file.text();
      const result = await previewImport(text);
      setPreview(result);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setLoading(false);
    }
  }

  async function handleImport() {
    if (!preview) return;
    setImporting(true);
    try {
      let collectionId: string;
      if (collections.length > 0) {
        collectionId = collections[0].id;
      } else {
        const created = await createCollection("My Collection");
        collectionId = created.id;
      }
      await commitImport(preview, collectionId, importFile?.name ?? null);
      setImportDone(true);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  async function handleFinish() {
    setLoading(true);
    try {
      await updateNotificationPreferences({
        emailAlerts,
        priceDropAlerts,
        valueExceededAlerts,
      });
      await markOnboarded();
      router.push("/portfolio");
    } catch {
      await markOnboarded();
      router.push("/portfolio");
    }
  }

  const stepIndex = { welcome: 0, import: 1, alerts: 2 }[step];

  return (
    <div className="w-full max-w-lg space-y-8">
      {/* Logo + progress */}
      <div className="flex flex-col items-center gap-4">
        <Logo />
        <div className="flex gap-2">
          {(["welcome", "import", "alerts"] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-1.5 w-12 rounded-full transition-colors ${
                i <= stepIndex ? "bg-[#4C6FFF]" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step: Welcome */}
      {step === "welcome" && (
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome{userName ? `, ${userName}` : ""}
            </h1>
            <p className="text-muted-foreground text-base">
              BrickX tracks your LEGO collection as an investment. Let&apos;s
              get you set up in two quick steps.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {[
              { label: "26,000+", sub: "sets tracked" },
              { label: "~11%", sub: "avg annual return" },
              { label: "Real-time", sub: "market data" },
            ].map(({ label, sub }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-4 space-y-1">
                <div className="font-semibold text-lg font-mono tabular-nums">{label}</div>
                <div className="text-muted-foreground text-xs">{sub}</div>
              </div>
            ))}
          </div>
          <Button className="w-full" onClick={() => setStep("import")}>
            Get started
          </Button>
        </div>
      )}

      {/* Step: Import */}
      {step === "import" && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs">Step 1 of 2</Badge>
            <h2 className="text-2xl font-bold tracking-tight">Import your collection</h2>
            <p className="text-muted-foreground text-sm">
              Upload a CSV or BrickLink XML export, or skip to add sets manually later.
            </p>
          </div>

          {!importDone ? (
            <div className="space-y-4">
              <div
                onClick={() => fileRef.current?.click()}
                className="border border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-[#4C6FFF]/50 hover:bg-[#4C6FFF]/5 transition-colors space-y-2"
              >
                <div className="text-muted-foreground text-sm">
                  {importFile
                    ? <span className="text-foreground font-medium">{importFile.name}</span>
                    : "Click to upload CSV or BrickLink XML"}
                </div>
                {!importFile && (
                  <div className="text-muted-foreground text-xs">
                    Supports BrickX CSV, BrickLink CSV, BrickLink XML (.bsx)
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,.xml,.bsx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {loading && (
                <p className="text-sm text-muted-foreground text-center">Parsing file…</p>
              )}

              {importError && (
                <p className="text-sm text-destructive text-center">{importError}</p>
              )}

              {preview && (
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ready to import</span>
                    <div className="flex gap-3">
                      <span className="text-green-500 font-medium font-mono">
                        {preview.matchedCount} matched
                      </span>
                      {preview.unmatchedCount > 0 && (
                        <span className="text-muted-foreground font-mono">
                          {preview.unmatchedCount} skipped
                        </span>
                      )}
                    </div>
                  </div>
                  {preview.parseErrors.length > 0 && (
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {preview.parseErrors.slice(0, 3).map((e, i) => (
                        <li key={i} className="text-destructive">{e}</li>
                      ))}
                    </ul>
                  )}
                  <Button
                    className="w-full"
                    onClick={handleImport}
                    disabled={importing || preview.matchedCount === 0}
                  >
                    {importing ? "Importing…" : `Import ${preview.matchedCount} sets`}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 text-center space-y-2">
              <div className="text-2xl font-bold text-green-500 font-mono">
                {preview?.matchedCount ?? 0} sets imported
              </div>
              <div className="text-sm text-muted-foreground">Added to your collection</div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep("alerts")}
            >
              {importDone ? "Next" : "Skip for now"}
            </Button>
            {!importDone && preview && preview.matchedCount > 0 && !loading && (
              <Button className="flex-1" onClick={handleImport} disabled={importing}>
                {importing ? "Importing…" : "Import"}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Step: Alerts */}
      {step === "alerts" && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs">Step 2 of 2</Badge>
            <h2 className="text-2xl font-bold tracking-tight">Price alerts</h2>
            <p className="text-muted-foreground text-sm">
              Get notified when sets in your collection hit your targets.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {[
              {
                id: "email-alerts",
                label: "Email notifications",
                desc: "Receive alerts via email",
                value: emailAlerts,
                onChange: setEmailAlerts,
              },
              {
                id: "price-drop",
                label: "Price drop alerts",
                desc: "When a set drops below your target",
                value: priceDropAlerts,
                onChange: setPriceDropAlerts,
              },
              {
                id: "value-exceeded",
                label: "Value exceeded alerts",
                desc: "When a set's value exceeds your target",
                value: valueExceededAlerts,
                onChange: setValueExceededAlerts,
              },
            ].map(({ id, label, desc, value, onChange }) => (
              <div key={id} className="flex items-center justify-between p-4">
                <div>
                  <Label htmlFor={id} className="font-medium cursor-pointer">
                    {label}
                  </Label>
                  <p className="text-muted-foreground text-xs mt-0.5">{desc}</p>
                </div>
                <Switch id={id} checked={value} onCheckedChange={onChange} />
              </div>
            ))}
          </div>

          <Button className="w-full" onClick={handleFinish} disabled={loading}>
            {loading ? "Setting up…" : "Go to my portfolio"}
          </Button>
        </div>
      )}
    </div>
  );
}
