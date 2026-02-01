import type { BrickEconomySetValuation } from "@/lib/types/brickeconomy";
import { validateEnv } from "@/lib/env";
import { createBrickEconomyLimiter } from "@/lib/utils/rate-limiter";
import { BaseApiClient } from "./base-api-client";

let client: BaseApiClient | undefined;

function getClient(): BaseApiClient {
  if (!client) {
    const env = validateEnv();
    client = new BaseApiClient({
      baseUrl: "https://www.brickeconomy.com/api/v1",
      headers: {
        Authorization: `Bearer ${env.BRICKECONOMY_API_KEY}`,
        Accept: "application/json",
      },
      rateLimiter: createBrickEconomyLimiter(),
    });
  }
  return client;
}

export async function getSetValuation(
  setNum: string,
): Promise<BrickEconomySetValuation> {
  return getClient().get<BrickEconomySetValuation>(`/set/${setNum}/valuation`);
}
