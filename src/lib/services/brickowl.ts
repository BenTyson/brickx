import type {
  BrickOwlIdLookupResponse,
  BrickOwlPricingResponse,
} from "@/lib/types/brickowl";
import { validateEnv } from "@/lib/env";
import { createBrickOwlLimiter } from "@/lib/utils/rate-limiter";
import { BaseApiClient } from "./base-api-client";

let apiKey: string | undefined;
let client: BaseApiClient | undefined;

function init(): { client: BaseApiClient; apiKey: string } {
  if (!client || !apiKey) {
    const env = validateEnv();
    apiKey = env.BRICKOWL_API_KEY;
    client = new BaseApiClient({
      baseUrl: "https://api.brickowl.com/v1",
      headers: {
        Accept: "application/json",
      },
      rateLimiter: createBrickOwlLimiter(),
    });
  }
  return { client, apiKey };
}

export async function lookupId(
  setNum: string,
): Promise<BrickOwlIdLookupResponse> {
  const { client: c, apiKey: key } = init();
  return c.get<BrickOwlIdLookupResponse>("/catalog/id_lookup", {
    key,
    id: setNum,
    type: "Set",
    id_type: "design_id",
  });
}

export async function getPricing(
  boid: string,
): Promise<BrickOwlPricingResponse> {
  const { client: c, apiKey: key } = init();
  return c.get<BrickOwlPricingResponse>("/catalog/pricing", {
    key,
    boid,
  });
}
