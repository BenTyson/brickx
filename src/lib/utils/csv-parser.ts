export type ImportFormat = "csv" | "bricklink_csv" | "bricklink_xml";

export interface ParsedRow {
  set_num: string;
  condition: "new" | "used";
  purchase_price: number | null;
  purchase_date: string | null;
  notes: string | null;
  quantity: number;
  raw: Record<string, string>;
}

export interface ParseResult {
  format: ImportFormat;
  rows: ParsedRow[];
  parseErrors: string[];
}

// Column aliases → canonical field names
const SET_NUM_ALIASES = new Set([
  "set_num", "set_id", "set number", "item_id", "item id", "item no",
  "item no.", "itemid", "set", "number", "id", "set no", "set no.",
]);
const CONDITION_ALIASES = new Set([
  "condition", "item_condition", "itemcondition", "cond",
]);
const PRICE_ALIASES = new Set([
  "purchase_price", "price", "cost", "paid", "purchase price", "buy price",
  "cost_price", "costprice", "paid_price",
]);
const DATE_ALIASES = new Set([
  "purchase_date", "date", "date_purchased", "datepurchased", "buy_date",
  "purchased", "purchase date", "bought",
]);
const NOTES_ALIASES = new Set([
  "notes", "note", "comment", "comments", "description", "remarks",
]);
const QTY_ALIASES = new Set([
  "quantity", "qty", "count", "amount",
]);

function normalizeHeader(h: string): string {
  return h.toLowerCase().trim().replace(/['"]/g, "");
}

function detectColumn(
  headers: string[],
  aliases: Set<string>,
): number {
  for (let i = 0; i < headers.length; i++) {
    if (aliases.has(normalizeHeader(headers[i]))) return i;
  }
  return -1;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeCondition(raw: string): "new" | "used" {
  const v = raw.toLowerCase().trim();
  if (v === "u" || v === "used") return "used";
  return "new";
}

function normalizeSetNum(raw: string): string {
  // Strip quotes, trim whitespace, uppercase for matching
  let s = raw.replace(/['"]/g, "").trim();
  // If no dash-variant suffix, append -1 as default
  if (s && !s.includes("-")) s = `${s}-1`;
  return s;
}

function parseDate(raw: string): string | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

export function parseCSV(text: string): ParseResult {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) {
    return { format: "csv", rows: [], parseErrors: ["File is empty or has no data rows"] };
  }

  const headers = parseCSVLine(lines[0]);
  const setNumIdx = detectColumn(headers, SET_NUM_ALIASES);
  const conditionIdx = detectColumn(headers, CONDITION_ALIASES);
  const priceIdx = detectColumn(headers, PRICE_ALIASES);
  const dateIdx = detectColumn(headers, DATE_ALIASES);
  const notesIdx = detectColumn(headers, NOTES_ALIASES);
  const qtyIdx = detectColumn(headers, QTY_ALIASES);

  if (setNumIdx === -1) {
    return {
      format: "csv",
      rows: [],
      parseErrors: [
        `Could not find a set number column. Headers found: ${headers.join(", ")}. Expected one of: set_num, set_id, item_id, item no.`,
      ],
    };
  }

  const rows: ParsedRow[] = [];
  const parseErrors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cells = parseCSVLine(line);
    const rawSetNum = cells[setNumIdx] ?? "";
    if (!rawSetNum) {
      parseErrors.push(`Row ${i + 1}: empty set number, skipped`);
      continue;
    }

    const setNum = normalizeSetNum(rawSetNum);
    const conditionRaw = conditionIdx >= 0 ? (cells[conditionIdx] ?? "") : "";
    const condition = normalizeCondition(conditionRaw);
    const priceRaw = priceIdx >= 0 ? (cells[priceIdx] ?? "") : "";
    const price = priceRaw ? parseFloat(priceRaw.replace(/[^0-9.-]/g, "")) : null;
    const dateRaw = dateIdx >= 0 ? (cells[dateIdx] ?? "") : "";
    const qty = qtyIdx >= 0 ? (parseInt(cells[qtyIdx] ?? "1", 10) || 1) : 1;

    const raw: Record<string, string> = {};
    headers.forEach((h, idx) => { raw[h] = cells[idx] ?? ""; });

    for (let q = 0; q < qty; q++) {
      rows.push({
        set_num: setNum,
        condition,
        purchase_price: price != null && !isNaN(price) ? price : null,
        purchase_date: parseDate(dateRaw),
        notes: notesIdx >= 0 ? (cells[notesIdx] ?? null) || null : null,
        quantity: 1,
        raw,
      });
    }
  }

  // Detect if headers look like a BrickLink CSV export
  const headerSet = new Set(headers.map(normalizeHeader));
  const isBrickLink = headerSet.has("item no.") || headerSet.has("itemid");
  return { format: isBrickLink ? "bricklink_csv" : "csv", rows, parseErrors };
}

export function parseBrickLinkXML(text: string): ParseResult {
  const rows: ParsedRow[] = [];
  const parseErrors: string[] = [];

  // Parse <Item> blocks — works for BrickStock .bsx and BrickLink wanted list XML
  const itemRegex = /<ITEM>([\s\S]*?)<\/ITEM>/gi;
  const fieldRegex = /<(\w+)>([\s\S]*?)<\/\1>/gi;

  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(text)) !== null) {
    const block = match[1];
    const fields: Record<string, string> = {};
    let f: RegExpExecArray | null;
    const fr = new RegExp(fieldRegex.source, "gi");
    while ((f = fr.exec(block)) !== null) {
      fields[f[1].toUpperCase()] = f[2].trim();
    }

    // Only process Sets (ItemTypeID = S)
    const itemType = (fields["ITEMTYPEID"] ?? fields["ITEMTYPE"] ?? "S").toUpperCase();
    if (itemType !== "S") continue;

    const rawId = fields["ITEMID"] ?? "";
    if (!rawId) {
      parseErrors.push("XML item missing ITEMID, skipped");
      continue;
    }

    const setNum = normalizeSetNum(rawId);
    const condRaw = fields["CONDITION"] ?? "N";
    const condition = condRaw.toUpperCase() === "U" ? "used" : "new";
    const priceRaw = fields["PRICE"] ?? fields["SALE_PRICE"] ?? "";
    const price = priceRaw ? parseFloat(priceRaw) : null;
    const qty = parseInt(fields["QTY"] ?? fields["MINQTY"] ?? "1", 10) || 1;

    for (let q = 0; q < qty; q++) {
      rows.push({
        set_num: setNum,
        condition,
        purchase_price: price != null && !isNaN(price) ? price : null,
        purchase_date: null,
        notes: null,
        quantity: 1,
        raw: fields,
      });
    }
  }

  if (rows.length === 0 && !text.includes("<ITEM>") && !text.includes("<Item>")) {
    parseErrors.push("No <ITEM> elements found. Is this a BrickLink XML file?");
  }

  return { format: "bricklink_xml", rows, parseErrors };
}

export function detectFormat(text: string): ImportFormat {
  const trimmed = text.trimStart();
  if (trimmed.startsWith("<")) return "bricklink_xml";
  return "csv";
}

export function parseImportFile(text: string): ParseResult {
  const format = detectFormat(text);
  if (format === "bricklink_xml") return parseBrickLinkXML(text);
  return parseCSV(text);
}
