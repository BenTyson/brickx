import type { PaginatedResponse } from "@/lib/types/api-common";
import type {
  RebrickableColor,
  RebrickablePart,
  RebrickableSet,
  RebrickableTheme,
  SetListParams,
} from "@/lib/types/rebrickable";
import { validateEnv } from "@/lib/env";
import { BaseApiClient } from "./base-api-client";

let client: BaseApiClient | undefined;

function getClient(): BaseApiClient {
  if (!client) {
    const env = validateEnv();
    client = new BaseApiClient({
      baseUrl: "https://rebrickable.com/api/v3",
      headers: {
        Authorization: `key ${env.REBRICKABLE_API_KEY}`,
        Accept: "application/json",
      },
    });
  }
  return client;
}

export async function getSets(
  params?: SetListParams,
): Promise<PaginatedResponse<RebrickableSet>> {
  const queryParams: Record<string, string> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) queryParams[key] = String(value);
    }
  }
  return getClient().get<PaginatedResponse<RebrickableSet>>(
    "/lego/sets/",
    queryParams,
  );
}

export async function getSet(setNum: string): Promise<RebrickableSet> {
  return getClient().get<RebrickableSet>(`/lego/sets/${setNum}/`);
}

export async function getThemes(): Promise<
  PaginatedResponse<RebrickableTheme>
> {
  return getClient().get<PaginatedResponse<RebrickableTheme>>("/lego/themes/", {
    page_size: "1000",
  });
}

export async function getColors(): Promise<
  PaginatedResponse<RebrickableColor>
> {
  return getClient().get<PaginatedResponse<RebrickableColor>>("/lego/colors/", {
    page_size: "1000",
  });
}

export async function getParts(
  params?: Pick<SetListParams, "page" | "page_size" | "search">,
): Promise<PaginatedResponse<RebrickablePart>> {
  const queryParams: Record<string, string> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) queryParams[key] = String(value);
    }
  }
  return getClient().get<PaginatedResponse<RebrickablePart>>(
    "/lego/parts/",
    queryParams,
  );
}
