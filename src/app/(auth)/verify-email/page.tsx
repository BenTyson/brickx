import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerifyEmailResendButton } from "@/components/auth/verify-email-resend";

export const metadata: Metadata = {
  title: "Verify email | BrickX",
  description: "Verify your email to finish creating your BrickX account.",
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { email } = await searchParams;

  return (
    <div className="space-y-6 text-center">
      <div
        className="mx-auto flex size-14 items-center justify-center rounded-full border border-border-emphasis bg-bg-raised"
        aria-hidden
      >
        <MailCheck className="size-7 text-accent" strokeWidth={1.75} />
      </div>
      <div className="space-y-2">
        <h1 className="font-serif-display text-[40px] leading-[1.05] tracking-tight text-text-primary">
          Check your email.
        </h1>
        <p className="text-body text-text-tertiary">
          {email ? (
            <>
              We sent a verification link to{" "}
              <span className="text-text-primary">{email}</span>.
            </>
          ) : (
            <>We sent a verification link to your inbox.</>
          )}{" "}
          Click it to finish setting up your account.
        </p>
      </div>

      <div className="rounded-xl border border-border-thin bg-bg-raised/40 p-4 text-left text-small text-text-tertiary">
        <p className="text-text-secondary">Didn&apos;t get it?</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-text-tertiary">
          <li>Check your spam folder.</li>
          <li>The link expires in 24 hours.</li>
          <li>Make sure you signed up with the right address.</li>
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <Suspense fallback={null}>
          <VerifyEmailResendButton email={email} />
        </Suspense>
        <Button variant="ghost" asChild className="h-11 min-h-11 w-full">
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </div>
    </div>
  );
}
