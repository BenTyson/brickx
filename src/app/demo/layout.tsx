import type { Metadata } from "next";
import { DemoCommandPaletteProvider } from "@/components/catalog-v2/demo-command-palette";
import { PageTransition } from "@/components/motion/page-transition";
import { ToastProvider } from "@/components/motion/toast";

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
    <DemoCommandPaletteProvider>
      <ToastProvider>
        <div className="min-h-screen bg-bg-base text-text-primary">
          <PageTransition>{children}</PageTransition>
        </div>
      </ToastProvider>
    </DemoCommandPaletteProvider>
  );
}
