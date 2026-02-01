import type { RateLimiter } from "@/lib/utils/rate-limiter";

export type ApiErrorCode =
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "NETWORK_ERROR"
  | "AUTH_ERROR"
  | "NOT_FOUND"
  | "SERVER_ERROR"
  | "UNKNOWN";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly statusCode: number | undefined;
  readonly retryable: boolean;

  constructor(
    message: string,
    code: ApiErrorCode,
    statusCode?: number,
    retryable?: boolean,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.retryable =
      retryable ??
      (code === "RATE_LIMITED" ||
        code === "SERVER_ERROR" ||
        code === "TIMEOUT");
  }
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface BaseApiClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  rateLimiter?: RateLimiter;
  maxRetries?: number;
  initialRetryDelayMs?: number;
  timeoutMs?: number;
}
