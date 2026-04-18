import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchUserCollections } from "@/lib/queries";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  // If already onboarded, skip
  const { data: profile } = await supabase
    .from("users")
    .select("onboarded_at, name")
    .eq("id", user.id)
    .single();

  if (profile?.onboarded_at) redirect("/portfolio");

  const collections = await fetchUserCollections();

  return (
    <OnboardingFlow
      userName={profile?.name ?? user.email?.split("@")[0] ?? ""}
      collections={collections}
    />
  );
}
