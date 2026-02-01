import type {
  BrickLinkApiResponse,
  BrickLinkCondition,
  BrickLinkPriceGuide,
} from "@/lib/types/bricklink";
import { validateEnv } from "@/lib/env";
import { buildAuthorizationHeader } from "@/lib/utils/oauth1";
import type { OAuthCredentials } from "@/lib/utils/oauth1";
import { createBrickLinkLimiter } from "@/lib/utils/rate-limiter";
import { BaseApiClient } from "./base-api-client";

class BrickLinkApiClient extends BaseApiClient {
  private readonly credentials: OAuthCredentials;

  constructor() {
    const env = validateEnv();
    super({
      baseUrl: "https://api.bricklink.com/api/store/v1",
      rateLimiter: createBrickLinkLimiter(),
      maxRetries: 2,
      headers: {
        Accept: "application/json",
      },
    });
    this.credentials = {
      consumerKey: env.BRICKLINK_CONSUMER_KEY,
      consumerSecret: env.BRICKLINK_CONSUMER_SECRET,
      token: env.BRICKLINK_TOKEN,
      tokenSecret: env.BRICKLINK_TOKEN_SECRET,
    };
  }

  protected override async prepareHeaders(
    url: string,
    method: string,
    params?: Record<string, string>,
  ): Promise<Record<string, string>> {
    const baseHeaders = await super.prepareHeaders(url, method, params);
    const parsedUrl = new URL(url);
    const baseUrl = `${parsedUrl.origin}${parsedUrl.pathname}`;
    const queryParams: Record<string, string> = {};
    parsedUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    const authHeader = buildAuthorizationHeader(
      this.credentials,
      method,
      baseUrl,
      queryParams,
    );

    return {
      ...baseHeaders,
      Authorization: authHeader,
    };
  }
}

let client: BrickLinkApiClient | undefined;

function getClient(): BrickLinkApiClient {
  if (!client) {
    client = new BrickLinkApiClient();
  }
  return client;
}

export async function getPriceGuide(
  setNum: string,
  condition: BrickLinkCondition = "N",
): Promise<BrickLinkPriceGuide> {
  const itemNo = setNum.replace(/-\d+$/, "");
  const response = await getClient().get<
    BrickLinkApiResponse<BrickLinkPriceGuide>
  >(`/items/SET/${itemNo}/price`, {
    new_or_used: condition,
    guide_type: "sold",
  });
  return response.data;
}
