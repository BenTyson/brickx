import { createWriteStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { createGunzip } from "node:zlib";
import { Readable } from "node:stream";

const CDN_BASE = "https://cdn.rebrickable.com/media/downloads";
const CSV_FILES = [
  "themes.csv",
  "sets.csv",
  "colors.csv",
  "parts.csv",
  "minifigs.csv",
];

const DATA_DIR = join(import.meta.dirname, "..", "data");

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function downloadAll(force = false): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });

  for (const name of CSV_FILES) {
    const outPath = join(DATA_DIR, name);

    if (!force && (await fileExists(outPath))) {
      console.log(
        `Skipping ${name} (already exists, use --force to re-download)`,
      );
      continue;
    }

    const url = `${CDN_BASE}/${name}.gz`;
    console.log(`Downloading ${url}...`);

    const response = await fetch(url);
    if (!response.ok || !response.body) {
      throw new Error(
        `Failed to download ${url}: ${response.status} ${response.statusText}`,
      );
    }

    const readable = Readable.fromWeb(
      response.body as import("node:stream/web").ReadableStream,
    );
    const gunzip = createGunzip();
    const writer = createWriteStream(outPath);

    await pipeline(readable, gunzip, writer);
    console.log(`  Saved ${outPath}`);
  }

  console.log("All CSV downloads complete");
}

if (import.meta.filename === process.argv[1]) {
  const force = process.argv.includes("--force");
  downloadAll(force).catch((err) => {
    console.error("Download failed:", err);
    process.exit(1);
  });
}
