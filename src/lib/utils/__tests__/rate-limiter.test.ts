import { describe, expect, it, vi } from "vitest";
import {
  RateLimiter,
  createBrickLinkLimiter,
  createBrickEconomyLimiter,
  createBrickOwlLimiter,
} from "../rate-limiter";

describe("RateLimiter", () => {
  it("initializes with max tokens", () => {
    const limiter = new RateLimiter({
      maxTokens: 10,
      refillAmount: 10,
      refillIntervalMs: 1000,
    });
    expect(limiter.availableTokens).toBe(10);
  });

  it("tryAcquire returns true when tokens available", () => {
    const limiter = new RateLimiter({
      maxTokens: 3,
      refillAmount: 3,
      refillIntervalMs: 1000,
    });
    expect(limiter.tryAcquire()).toBe(true);
    expect(limiter.availableTokens).toBe(2);
  });

  it("tryAcquire returns false when no tokens available", () => {
    const limiter = new RateLimiter({
      maxTokens: 1,
      refillAmount: 1,
      refillIntervalMs: 1000,
    });
    expect(limiter.tryAcquire()).toBe(true);
    expect(limiter.tryAcquire()).toBe(false);
  });

  it("acquire returns 0 when tokens are available", async () => {
    const limiter = new RateLimiter({
      maxTokens: 5,
      refillAmount: 5,
      refillIntervalMs: 1000,
    });
    const waited = await limiter.acquire();
    expect(waited).toBe(0);
    expect(limiter.availableTokens).toBe(4);
  });

  it("acquire waits and returns wait time when no tokens available", async () => {
    const limiter = new RateLimiter({
      maxTokens: 1,
      refillAmount: 1,
      refillIntervalMs: 100,
    });
    limiter.tryAcquire(); // exhaust tokens

    const start = Date.now();
    const waited = await limiter.acquire();
    const elapsed = Date.now() - start;

    expect(waited).toBeGreaterThan(0);
    expect(elapsed).toBeGreaterThanOrEqual(50); // allow some timer variance
  });

  it("refills tokens after interval elapses", async () => {
    vi.useFakeTimers();
    try {
      const limiter = new RateLimiter({
        maxTokens: 5,
        refillAmount: 5,
        refillIntervalMs: 1000,
      });

      // Drain all tokens
      for (let i = 0; i < 5; i++) limiter.tryAcquire();
      expect(limiter.availableTokens).toBe(0);

      // Advance time past one refill interval
      vi.advanceTimersByTime(1000);
      expect(limiter.availableTokens).toBe(5);
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not exceed max token cap on refill", () => {
    vi.useFakeTimers();
    try {
      const limiter = new RateLimiter({
        maxTokens: 10,
        refillAmount: 10,
        refillIntervalMs: 1000,
      });

      // Advance several intervals without consuming
      vi.advanceTimersByTime(5000);
      expect(limiter.availableTokens).toBe(10);
    } finally {
      vi.useRealTimers();
    }
  });

  it("stores optional name", () => {
    const limiter = new RateLimiter({
      maxTokens: 1,
      refillAmount: 1,
      refillIntervalMs: 1000,
      name: "test-limiter",
    });
    expect(limiter.name).toBe("test-limiter");
  });

  it("name is undefined when not provided", () => {
    const limiter = new RateLimiter({
      maxTokens: 1,
      refillAmount: 1,
      refillIntervalMs: 1000,
    });
    expect(limiter.name).toBeUndefined();
  });
});

describe("factory functions", () => {
  it("createBrickLinkLimiter returns a named limiter with 5000 tokens", () => {
    const limiter = createBrickLinkLimiter();
    expect(limiter.name).toBe("bricklink");
    expect(limiter.availableTokens).toBe(5000);
  });

  it("createBrickEconomyLimiter returns a named limiter with 60 tokens", () => {
    const limiter = createBrickEconomyLimiter();
    expect(limiter.name).toBe("brickeconomy");
    expect(limiter.availableTokens).toBe(60);
  });

  it("createBrickOwlLimiter returns a named limiter with 100 tokens", () => {
    const limiter = createBrickOwlLimiter();
    expect(limiter.name).toBe("brickowl");
    expect(limiter.availableTokens).toBe(100);
  });
});
