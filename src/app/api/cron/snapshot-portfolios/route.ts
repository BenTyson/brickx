import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  computeUserSnapshot,
  listUsersWithItems,
  upsertSnapshot,
} from "@/lib/services/portfolio-snapshot";
import { logger } from "@/lib/utils/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;

  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  let userIds: string[];
  try {
    userIds = await listUsersWithItems(supabase);
  } catch {
    return NextResponse.json(
      { error: "failed to list users" },
      { status: 500 },
    );
  }

  let success = 0;
  let failed = 0;

  for (const userId of userIds) {
    try {
      const snapshot = await computeUserSnapshot(supabase, userId);
      await upsertSnapshot(supabase, userId, today, snapshot);
      success += 1;
    } catch (err) {
      failed += 1;
      logger.error("Snapshot failed for user", {
        userId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  logger.info("Portfolio snapshot job complete", {
    date: today,
    success,
    failed,
  });

  return NextResponse.json({
    date: today,
    users: userIds.length,
    success,
    failed,
  });
}
