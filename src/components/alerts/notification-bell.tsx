"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function NotificationBell() {
  const [count, setCount] = useState(0);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setAuthed(true);

      supabase
        .from("price_alerts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false)
        .eq("status", "triggered")
        .then(({ count: c }) => {
          setCount(c ?? 0);
        });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session?.user);
      if (!session?.user) {
        setCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!authed) return null;

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/alerts" aria-label="View alerts">
        <Bell className="size-5" />
        {count > 0 && (
          <span className="bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-bold">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </Link>
    </Button>
  );
}
