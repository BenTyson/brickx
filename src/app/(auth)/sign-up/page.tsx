import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up | BrickX",
  description:
    "Create a BrickX account to start tracking your LEGO collection and portfolio.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
