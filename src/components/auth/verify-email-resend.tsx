"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function VerifyEmailResendButton({ email }: { email?: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleResend() {
    if (!email) {
      setError("Enter your email on the sign-up page to resend.");
      setStatus("error");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        className="h-11 min-h-11 w-full"
        onClick={handleResend}
        disabled={loading || status === "sent"}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden />}
        {status === "sent" ? "Sent — check your inbox" : "Resend verification"}
      </Button>
      {status === "error" && (
        <p
          className="text-small text-danger"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
