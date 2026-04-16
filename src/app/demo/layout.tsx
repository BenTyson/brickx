import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BrickX Demo Workbench",
  description:
    "Internal design system workbench. Not linked from production navigation.",
  robots: { index: false, follow: false },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">{children}</div>
  );
}
