import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ExportRow {
  set_num: string;
  name: string;
  theme: string;
  condition: string;
  purchase_date: string;
  purchase_price: string;
  current_value: string;
  gain_loss: string;
  notes: string;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = request.nextUrl;
  const format = searchParams.get("format") ?? "csv";
  const collectionId = searchParams.get("collectionId");

  // Build query for all user collections or a specific one
  let itemsQuery = supabase
    .from("collection_items")
    .select(
      "set_id, condition, purchase_price, purchase_date, notes, sets(name, themes(name)), set_market_values:sets!inner(set_market_values(market_value_new, market_value_used)), collections!inner(user_id)",
    )
    .eq("collections.user_id", user.id);

  if (collectionId) {
    itemsQuery = itemsQuery.eq("collection_id", collectionId);
  }

  const { data: items, error } = await itemsQuery;
  if (error) return new NextResponse("Internal error", { status: 500 });

  const rows: ExportRow[] = (items ?? []).map((item) => {
    const set = item.sets as unknown as {
      name: string;
      themes: { name: string } | null;
    };
    const mv = (
      item.set_market_values as unknown as {
        set_market_values: { market_value_new: number | null; market_value_used: number | null }[];
      }
    )?.set_market_values?.[0];

    const currentValue =
      item.condition === "new" ? (mv?.market_value_new ?? 0) : (mv?.market_value_used ?? 0);
    const purchasePrice = item.purchase_price ?? 0;
    const gainLoss = currentValue > 0 && purchasePrice > 0 ? currentValue - purchasePrice : 0;

    return {
      set_num: item.set_id,
      name: set?.name ?? "",
      theme: set?.themes?.name ?? "",
      condition: item.condition,
      purchase_date: item.purchase_date ?? "",
      purchase_price: purchasePrice > 0 ? purchasePrice.toFixed(2) : "",
      current_value: currentValue > 0 ? currentValue.toFixed(2) : "",
      gain_loss: gainLoss !== 0 ? gainLoss.toFixed(2) : "",
      notes: item.notes ?? "",
    };
  });

  const filename = collectionId
    ? `brickx-collection-${collectionId.slice(0, 8)}`
    : "brickx-all-collections";

  if (format === "json") {
    return new NextResponse(JSON.stringify(rows, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}.json"`,
      },
    });
  }

  // CSV
  const header = "set_num,name,theme,condition,purchase_date,purchase_price,current_value,gain_loss,notes";
  const csvRows = rows.map((r) =>
    [
      r.set_num,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.theme.replace(/"/g, '""')}"`,
      r.condition,
      r.purchase_date,
      r.purchase_price,
      r.current_value,
      r.gain_loss,
      `"${(r.notes ?? "").replace(/"/g, '""')}"`,
    ].join(","),
  );
  const csv = [header, ...csvRows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    },
  });
}
