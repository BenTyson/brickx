import Link from "next/link";
import { Logo } from "@/components/logo";
import { AuthShowcase } from "@/components/auth/auth-showcase";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh bg-bg-base">
      <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Showcase pane — hidden on mobile, visible on lg+ */}
        <aside
          aria-hidden
          className="relative hidden overflow-hidden border-r border-border-thin lg:block"
        >
          <AuthShowcase />
        </aside>

        {/* Form pane */}
        <main className="relative flex min-h-dvh flex-col">
          <header className="flex items-center justify-between px-6 py-5 sm:px-8">
            <Link
              href="/"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-md"
              aria-label="BrickX home"
            >
              <Logo variant="full" />
            </Link>
            <Link
              href="/sets"
              className="text-small text-text-tertiary transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-md px-2 py-1"
            >
              Browse sets →
            </Link>
          </header>

          <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10">
            <div className="w-full max-w-[400px]">{children}</div>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border-thin px-6 py-4 text-micro font-mono text-text-quaternary sm:px-8">
            <span className="tracking-wider">© BrickX · LEGO® is a trademark of the LEGO Group</span>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="transition hover:text-text-secondary"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="transition hover:text-text-secondary"
              >
                Terms
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
