import { sleep } from "./sleep";

export interface RateLimiterConfig {
  maxTokens: number;
  refillAmount: number;
  refillIntervalMs: number;
  name?: string;
}

export class RateLimiter {
  private tokens: number;
  private lastRefillTime: number;
  private readonly maxTokens: number;
  private readonly refillAmount: number;
  private readonly refillIntervalMs: number;
  readonly name: string | undefined;

  constructor(config: RateLimiterConfig) {
    this.maxTokens = config.maxTokens;
    this.refillAmount = config.refillAmount;
    this.refillIntervalMs = config.refillIntervalMs;
    this.name = config.name;
    this.tokens = config.maxTokens;
    this.lastRefillTime = Date.now();
  }

  get availableTokens(): number {
    this.refill();
    return this.tokens;
  }

  tryAcquire(): boolean {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }

  async acquire(): Promise<number> {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return 0;
    }

    const elapsed = Date.now() - this.lastRefillTime;
    const waitMs = this.refillIntervalMs - elapsed;
    const actualWait = Math.max(waitMs, 0);
    await sleep(actualWait);
    this.refill();
    this.tokens -= 1;
    return actualWait;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefillTime;
    const intervals = Math.floor(elapsed / this.refillIntervalMs);
    if (intervals > 0) {
      this.tokens = Math.min(
        this.maxTokens,
        this.tokens + intervals * this.refillAmount,
      );
      this.lastRefillTime += intervals * this.refillIntervalMs;
    }
  }
}

/** BrickLink: 5000 requests per day */
export function createBrickLinkLimiter(): RateLimiter {
  return new RateLimiter({
    maxTokens: 5000,
    refillAmount: 5000,
    refillIntervalMs: 24 * 60 * 60 * 1000,
    name: "bricklink",
  });
}

/** BrickEconomy: 60 requests per minute */
export function createBrickEconomyLimiter(): RateLimiter {
  return new RateLimiter({
    maxTokens: 60,
    refillAmount: 60,
    refillIntervalMs: 60 * 1000,
    name: "brickeconomy",
  });
}

/** BrickOwl: 100 requests per minute */
export function createBrickOwlLimiter(): RateLimiter {
  return new RateLimiter({
    maxTokens: 100,
    refillAmount: 100,
    refillIntervalMs: 60 * 1000,
    name: "brickowl",
  });
}
