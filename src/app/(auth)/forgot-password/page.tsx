import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset password | BrickX",
  description: "Request a password reset link for your BrickX account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
