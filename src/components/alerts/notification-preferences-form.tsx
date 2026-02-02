"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateNotificationPreferences } from "@/lib/actions/alerts";
import type { NotificationPreferences } from "@/lib/types/alerts";

interface NotificationPreferencesFormProps {
  preferences: NotificationPreferences | null;
}

export function NotificationPreferencesForm({
  preferences,
}: NotificationPreferencesFormProps) {
  const [emailAlerts, setEmailAlerts] = useState(
    preferences?.email_alerts ?? true,
  );
  const [priceDropAlerts, setPriceDropAlerts] = useState(
    preferences?.price_drop_alerts ?? true,
  );
  const [valueExceededAlerts, setValueExceededAlerts] = useState(
    preferences?.value_exceeded_alerts ?? true,
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      await updateNotificationPreferences({
        emailAlerts,
        priceDropAlerts,
        valueExceededAlerts,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Error handled by server action
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose which alerts you want to receive. Email delivery is coming
          soon.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="emailAlerts" className="flex flex-col gap-1">
            <span>Email Notifications</span>
            <span className="text-muted-foreground text-sm font-normal">
              Receive alerts via email (coming soon)
            </span>
          </Label>
          <Switch
            id="emailAlerts"
            checked={emailAlerts}
            onCheckedChange={setEmailAlerts}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="priceDropAlerts" className="flex flex-col gap-1">
            <span>Price Drop Alerts</span>
            <span className="text-muted-foreground text-sm font-normal">
              Get notified when prices decrease
            </span>
          </Label>
          <Switch
            id="priceDropAlerts"
            checked={priceDropAlerts}
            onCheckedChange={setPriceDropAlerts}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="valueExceededAlerts" className="flex flex-col gap-1">
            <span>Value Exceeded Alerts</span>
            <span className="text-muted-foreground text-sm font-normal">
              Get notified when values exceed thresholds
            </span>
          </Label>
          <Switch
            id="valueExceededAlerts"
            checked={valueExceededAlerts}
            onCheckedChange={setValueExceededAlerts}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
          {saved && (
            <span className="text-sm text-green-500">Saved successfully</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
