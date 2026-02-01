type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function getThreshold(): LogLevel {
  const raw = process.env.LOG_LEVEL?.toLowerCase();
  if (raw && raw in LEVEL_ORDER) return raw as LogLevel;
  return "info";
}

function log(
  level: LogLevel,
  message: string,
  metadata?: Record<string, unknown>,
): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[getThreshold()]) return;

  const entry: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };
  if (metadata !== undefined) entry.metadata = metadata;

  const method =
    level === "error" ? "error" : level === "warn" ? "warn" : "log";
  console[method](JSON.stringify(entry));
}

export const logger = {
  debug: (message: string, metadata?: Record<string, unknown>) =>
    log("debug", message, metadata),
  info: (message: string, metadata?: Record<string, unknown>) =>
    log("info", message, metadata),
  warn: (message: string, metadata?: Record<string, unknown>) =>
    log("warn", message, metadata),
  error: (message: string, metadata?: Record<string, unknown>) =>
    log("error", message, metadata),
};
