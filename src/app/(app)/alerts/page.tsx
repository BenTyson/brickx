import type { Metadata } from "next";
import Link from "next/link";
import { Settings } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertList } from "@/components/alerts/alert-list";
import { fetchUserAlerts } from "@/lib/queries";
import { markAllAlertsRead } from "@/lib/actions/alerts";
import type { AlertStatus } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Alerts | BrickX",
  description: "Manage your price alerts and notifications.",
};

interface AlertsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AlertsPage({ searchParams }: AlertsPageProps) {
  const raw = await searchParams;
  const tab = (raw.tab as string) ?? "active";

  const statusFilter: AlertStatus | "all" =
    tab === "triggered" ? "triggered" : tab === "all" ? "all" : "active";

  const alerts = await fetchUserAlerts(statusFilter);
  const hasUnread = alerts.some((a) => !a.is_read && a.status === "triggered");

  return (
    <div className="py-8">
      <PageContainer className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
            <p className="text-muted-foreground mt-1">
              Track price changes and set notifications.
            </p>
          </div>
          <div className="flex gap-2">
            {hasUnread && (
              <form action={markAllAlertsRead}>
                <Button variant="outline" size="sm" type="submit">
                  Mark All Read
                </Button>
              </form>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link href="/alerts/preferences">
                <Settings className="size-4" />
                Preferences
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue={tab}>
          <TabsList>
            <TabsTrigger value="active" asChild>
              <Link href="/alerts?tab=active">Active</Link>
            </TabsTrigger>
            <TabsTrigger value="triggered" asChild>
              <Link href="/alerts?tab=triggered">Triggered</Link>
            </TabsTrigger>
            <TabsTrigger value="all" asChild>
              <Link href="/alerts?tab=all">All</Link>
            </TabsTrigger>
          </TabsList>
          <TabsContent value={tab} className="mt-6">
            <AlertList alerts={alerts} />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
}
