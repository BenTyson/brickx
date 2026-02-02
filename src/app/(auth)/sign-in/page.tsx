import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In | BrickX",
  description:
    "Sign in to your BrickX account to manage collections and track your LEGO portfolio.",
};

export default function SignInPage() {
  return <SignInForm />;
}
