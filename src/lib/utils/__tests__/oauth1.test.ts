import { describe, expect, it } from "vitest";
import {
  percentEncode,
  generateNonce,
  generateTimestamp,
  buildSignatureBaseString,
  computeSignature,
  buildAuthorizationHeader,
} from "../oauth1";

describe("percentEncode", () => {
  it("encodes RFC 3986 reserved characters", () => {
    expect(percentEncode("!")).toBe("%21");
    expect(percentEncode("*")).toBe("%2A");
    expect(percentEncode("'")).toBe("%27");
    expect(percentEncode("(")).toBe("%28");
    expect(percentEncode(")")).toBe("%29");
  });

  it("does not encode unreserved characters", () => {
    expect(percentEncode("abcXYZ")).toBe("abcXYZ");
    expect(percentEncode("0123456789")).toBe("0123456789");
    expect(percentEncode("-._~")).toBe("-._~");
  });

  it("encodes spaces as %20", () => {
    expect(percentEncode("hello world")).toBe("hello%20world");
  });

  it("encodes special characters", () => {
    expect(percentEncode("foo+bar")).toBe("foo%2Bbar");
    expect(percentEncode("100%")).toBe("100%25");
  });
});

describe("generateNonce", () => {
  it("returns a 32 character hex string", () => {
    const nonce = generateNonce();
    expect(nonce).toMatch(/^[0-9a-f]{32}$/);
  });

  it("generates unique values", () => {
    const nonces = new Set(Array.from({ length: 100 }, () => generateNonce()));
    expect(nonces.size).toBe(100);
  });
});

describe("generateTimestamp", () => {
  it("returns a numeric string close to current time", () => {
    const ts = generateTimestamp();
    expect(ts).toMatch(/^\d+$/);

    const now = Math.floor(Date.now() / 1000);
    const parsed = parseInt(ts, 10);
    expect(Math.abs(now - parsed)).toBeLessThanOrEqual(2);
  });
});

describe("buildSignatureBaseString", () => {
  it("constructs a correct signature base string", () => {
    const result = buildSignatureBaseString(
      "GET",
      "https://api.example.com/resource",
      {
        oauth_consumer_key: "key",
        oauth_nonce: "nonce",
        b_param: "b_value",
        a_param: "a_value",
      },
    );

    // Method should be uppercase
    expect(result).toMatch(/^GET&/);
    // URL should be percent-encoded
    expect(result).toContain(percentEncode("https://api.example.com/resource"));
    // Parameters should be sorted
    const paramString = result.split("&")[2];
    const decoded = decodeURIComponent(paramString);
    const paramNames = decoded.split("&").map((p) => p.split("=")[0]);
    expect(paramNames).toEqual([...paramNames].sort());
  });

  it("uppercases the HTTP method", () => {
    const result = buildSignatureBaseString("post", "https://example.com", {});
    expect(result).toMatch(/^POST&/);
  });
});

describe("computeSignature", () => {
  // Known test vector from RFC 5849 section 1.2 (adapted)
  it("computes HMAC-SHA1 signature with known values", () => {
    const baseString =
      "GET&http%3A%2F%2Fphotos.example.net%2Fphotos&file%3Dvacation.jpg%26oauth_consumer_key%3Ddpf43f3p2l4k3l03%26oauth_nonce%3Dkllo9940pd9333jh%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1191242096%26oauth_token%3Dnnch734d00sl2jdk%26oauth_version%3D1.0%26size%3Doriginal";

    const signature = computeSignature(
      baseString,
      "kd94hf93k423kf44",
      "pfkkdhi9sl3r4s00",
    );

    expect(signature).toBe("tR3+Ty81lMeYAr/Fid0kMTYa/WM=");
  });

  it("handles empty token secret", () => {
    const sig = computeSignature("base", "consumer_secret", "");
    expect(typeof sig).toBe("string");
    expect(sig.length).toBeGreaterThan(0);
  });
});

describe("buildAuthorizationHeader", () => {
  it("returns a string starting with OAuth", () => {
    const header = buildAuthorizationHeader(
      {
        consumerKey: "ck",
        consumerSecret: "cs",
        token: "tk",
        tokenSecret: "ts",
      },
      "GET",
      "https://api.example.com/test",
    );

    expect(header).toMatch(/^OAuth /);
  });

  it("contains all required OAuth parameters", () => {
    const header = buildAuthorizationHeader(
      {
        consumerKey: "my_consumer_key",
        consumerSecret: "cs",
        token: "my_token",
        tokenSecret: "ts",
      },
      "GET",
      "https://api.example.com/test",
    );

    expect(header).toContain("oauth_consumer_key=");
    expect(header).toContain("oauth_nonce=");
    expect(header).toContain("oauth_signature=");
    expect(header).toContain("oauth_signature_method=");
    expect(header).toContain("oauth_timestamp=");
    expect(header).toContain("oauth_token=");
    expect(header).toContain("oauth_version=");
  });

  it("includes consumer key and token values", () => {
    const header = buildAuthorizationHeader(
      {
        consumerKey: "my_key",
        consumerSecret: "cs",
        token: "my_token",
        tokenSecret: "ts",
      },
      "GET",
      "https://api.example.com/test",
    );

    expect(header).toContain("my_key");
    expect(header).toContain("my_token");
  });

  it("generates different headers on successive calls (fresh nonce/timestamp)", () => {
    const creds = {
      consumerKey: "ck",
      consumerSecret: "cs",
      token: "tk",
      tokenSecret: "ts",
    };
    const h1 = buildAuthorizationHeader(creds, "GET", "https://example.com/a");
    const h2 = buildAuthorizationHeader(creds, "GET", "https://example.com/a");

    // Nonce should differ, making headers different
    expect(h1).not.toBe(h2);
  });
});
