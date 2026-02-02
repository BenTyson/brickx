"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Check, Eye, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dismissAlert, markAlertRead, deleteAlert } from "@/lib/actions/alerts";
import type { PriceAlert } from "@/lib/types/alerts";

interface AlertListProps {
  alerts: PriceAlert[];
}

function alertTypeLabel(type: string): string {
  switch (type) {
    case "price_drop":
      return "Price Drop";
    case "price_target":
      return "Price Target";
    case "value_exceeded":
      return "Value Exceeded";
    default:
      return type;
  }
}

function statusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default";
    case "triggered":
      return "destructive";
    case "dismissed":
      return "secondary";
    default:
      return "outline";
  }
}

export function AlertList({ alerts }: AlertListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (id: string, action: () => Promise<void>) => {
    setLoading(id);
    try {
      await action();
    } catch {
      // Error handled by server action
    } finally {
      setLoading(null);
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Bell className="text-muted-foreground/50 mb-4 size-12" />
        <p className="text-muted-foreground text-lg">No alerts yet</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Create alerts from any set detail page to track price changes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card
          key={alert.id}
          className={!alert.is_read ? "border-primary/30" : ""}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <CardTitle className="truncate text-base">
                  <Link
                    href={`/sets/${alert.set_id}`}
                    className="hover:underline"
                  >
                    {alert.set_name ?? alert.set_id}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {alertTypeLabel(alert.alert_type)}
                  {alert.target_price != null &&
                    ` \u2014 Target: $${alert.target_price.toFixed(2)}`}
                  {alert.threshold_pct != null &&
                    ` \u2014 Threshold: ${alert.threshold_pct}%`}
                </CardDescription>
              </div>
              <Badge variant={statusVariant(alert.status)}>
                {alert.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2">
              <div className="text-muted-foreground text-sm">
                {alert.status === "triggered" &&
                  alert.triggered_value != null && (
                    <span>
                      Triggered at ${alert.triggered_value.toFixed(2)}
                      {alert.triggered_at &&
                        ` on ${new Date(alert.triggered_at).toLocaleDateString()}`}
                    </span>
                  )}
                {alert.status === "active" && (
                  <span>
                    Created {new Date(alert.created_at).toLocaleDateString()}
                  </span>
                )}
                {alert.status === "dismissed" && <span>Dismissed</span>}
              </div>
              <div className="flex gap-1">
                {!alert.is_read && alert.status === "triggered" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleAction(alert.id, () => markAlertRead(alert.id))
                    }
                    disabled={loading === alert.id}
                    title="Mark as read"
                  >
                    <Eye className="size-4" />
                  </Button>
                )}
                {alert.status === "active" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleAction(alert.id, () => dismissAlert(alert.id))
                    }
                    disabled={loading === alert.id}
                    title="Dismiss"
                  >
                    <X className="size-4" />
                  </Button>
                )}
                {alert.status === "triggered" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleAction(alert.id, () => dismissAlert(alert.id))
                    }
                    disabled={loading === alert.id}
                    title="Dismiss"
                  >
                    <Check className="size-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleAction(alert.id, () => deleteAlert(alert.id))
                  }
                  disabled={loading === alert.id}
                  title="Delete"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
