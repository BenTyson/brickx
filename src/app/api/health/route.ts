import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { Database } from "@/lib/types/database";

const CATALOG_TABLES = [
  "themes",
  "sets",
  "set_prices",
  "set_market_values",
  "colors",
  "parts",
  "minifigs",
] as const;

export async function GET() {
  const start = Date.now();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      {
        status: "error",
        database: "not_configured",
        message: "Missing Supabase environment variables",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }

  const supabase = createClient<Database>(url, key);

  try {
    const countResults = await Promise.all(
      CATALOG_TABLES.map(async (table) => {
        const { count, error } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });
        if (error) throw error;
        return [table, count ?? 0] as const;
      }),
    );

    const counts = Object.fromEntries(countResults);
    const latencyMs = Date.now() - start;

    return NextResponse.json({
      status: "ok",
      database: "connected",
      latency_ms: latencyMs,
      counts,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const latencyMs = Date.now() - start;
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        latency_ms: latencyMs,
        message: err instanceof Error ? err.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
