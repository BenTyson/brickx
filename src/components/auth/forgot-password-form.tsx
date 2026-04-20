"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/portfolio`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div
          className="mx-auto flex size-14 items-center justify-center rounded-full border border-border-emphasis bg-bg-raised"
          aria-hidden
        >
          <Mail className="size-7 text-accent" strokeWidth={1.75} />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif-display text-[36px] leading-[1.05] tracking-tight text-text-primary">
            Check your inbox.
          </h1>
          <p className="text-body text-text-tertiary">
            If an account exists for{" "}
            <span className="text-text-primary">{email}</span>, a password
            reset link is on its way.
          </p>
        </div>
        <Button variant="outline" asChild className="h-11 min-h-11 w-full">
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-micro font-mono uppercase tracking-[0.2em] text-text-tertiary transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Sign in
        </Link>
        <h1 className="font-serif-display text-[40px] leading-[1.05] tracking-tight text-text-primary sm:text-[44px]">
          Reset your password.
        </h1>
        <p className="text-body text-text-tertiary">
          Enter the email on your account. We&apos;ll send a link to reset it.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-small text-text-secondary">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-11"
          />
        </div>

        {error && (
          <p
            className="text-small text-danger"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="h-11 min-h-11 w-full"
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin" aria-hidden />}
          Send reset link
        </Button>
      </form>
    </div>
  );
}
