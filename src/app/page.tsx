export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold">BrickX</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          LEGO Investment Platform
        </p>
        <a
          href="/api/health"
          className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Health Check
        </a>
      </main>
    </div>
  );
}
