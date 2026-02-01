import type { BaseApiClientConfig } from "@/lib/types/api-common";
import { ApiError } from "@/lib/types/api-common";
import { logger } from "@/lib/utils/logger";
import type { RateLimiter } from "@/lib/utils/rate-limiter";
import { sleep } from "@/lib/utils/sleep";

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_INITIAL_RETRY_DELAY_MS = 1000;
const DEFAULT_TIMEOUT_MS = 30_000;

export class BaseApiClient {
  protected readonly baseUrl: string;
  protected readonly headers: Record<string, string>;
  protected readonly rateLimiter: RateLimiter | undefined;
  protected readonly maxRetries: number;
  protected readonly initialRetryDelayMs: number;
  protected readonly timeoutMs: number;

  constructor(config: BaseApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.headers = config.headers ?? {};
    this.rateLimiter = config.rateLimiter;
    this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.initialRetryDelayMs =
      config.initialRetryDelayMs ?? DEFAULT_INITIAL_RETRY_DELAY_MS;
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    if (this.rateLimiter) {
      const waited = await this.rateLimiter.acquire();
      if (waited > 0) {
        logger.debug("Rate limiter wait", {
          limiter: this.rateLimiter.name,
          waitedMs: waited,
        });
      }
    }

    const url = this.buildUrl(path, params);

    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) {
        const delay =
          this.initialRetryDelayMs * Math.pow(2, attempt - 1) +
          Math.random() * this.initialRetryDelayMs * 0.5;
        logger.warn("Retrying request", {
          url,
          attempt,
          delayMs: Math.round(delay),
        });
        await sleep(delay);
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const headers = await this.prepareHeaders(url, "GET", params);
        const response = await fetch(url, {
          method: "GET",
          headers,
          signal: controller.signal,
        });

        if (!response.ok) {
          const error = this.classifyError(response.status, url);
          if (!error.retryable || attempt === this.maxRetries) {
            throw error;
          }
          lastError = error;
          continue;
        }

        return (await response.json()) as T;
      } catch (err) {
        if (err instanceof ApiError) {
          if (!err.retryable || attempt === this.maxRetries) throw err;
          lastError = err;
          continue;
        }

        if (err instanceof DOMException && err.name === "AbortError") {
          const apiErr = new ApiError(
            `Request timed out after ${this.timeoutMs}ms: ${url}`,
            "TIMEOUT",
            undefined,
            true,
          );
          if (attempt === this.maxRetries) throw apiErr;
          lastError = apiErr;
          continue;
        }

        const apiErr = new ApiError(
          `Network error: ${err instanceof Error ? err.message : String(err)}`,
          "NETWORK_ERROR",
          undefined,
          true,
        );
        if (attempt === this.maxRetries) throw apiErr;
        lastError = apiErr;
      } finally {
        clearTimeout(timeout);
      }
    }

    throw lastError ?? new ApiError("Request failed after retries", "UNKNOWN");
  }

  protected async prepareHeaders(
    _url: string,
    _method: string,
    _params?: Record<string, string>,
  ): Promise<Record<string, string>> {
    return { ...this.headers };
  }

  protected buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
      }
    }
    return url.toString();
  }

  private classifyError(statusCode: number, url: string): ApiError {
    if (statusCode === 429) {
      return new ApiError(
        `Rate limited: ${url}`,
        "RATE_LIMITED",
        statusCode,
        true,
      );
    }
    if (statusCode >= 500) {
      return new ApiError(
        `Server error ${statusCode}: ${url}`,
        "SERVER_ERROR",
        statusCode,
        true,
      );
    }
    if (statusCode === 401 || statusCode === 403) {
      return new ApiError(
        `Auth error ${statusCode}: ${url}`,
        "AUTH_ERROR",
        statusCode,
        false,
      );
    }
    if (statusCode === 404) {
      return new ApiError(`Not found: ${url}`, "NOT_FOUND", statusCode, false);
    }
    return new ApiError(
      `HTTP error ${statusCode}: ${url}`,
      "UNKNOWN",
      statusCode,
      false,
    );
  }
}
