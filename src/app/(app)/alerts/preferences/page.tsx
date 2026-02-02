import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { NotificationPreferencesForm } from "@/components/alerts/notification-preferences-form";
import { fetchNotificationPreferences } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Alert Preferences | BrickX",
  description: "Configure your notification preferences.",
};

export default async function AlertPreferencesPage() {
  const preferences = await fetchNotificationPreferences();

  return (
    <div className="py-8">
      <PageContainer className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Alert Preferences
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure how and when you receive notifications.
          </p>
        </div>

        <NotificationPreferencesForm preferences={preferences} />
      </PageContainer>
    </div>
  );
}
