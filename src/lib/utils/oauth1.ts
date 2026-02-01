import { createHmac, randomBytes } from "node:crypto";

export interface OAuthCredentials {
  consumerKey: string;
  consumerSecret: string;
  token: string;
  tokenSecret: string;
}

export function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

export function generateNonce(): string {
  return randomBytes(16).toString("hex");
}

export function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

export function buildSignatureBaseString(
  method: string,
  baseUrl: string,
  params: Record<string, string>,
): string {
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys
    .map((k) => `${percentEncode(k)}=${percentEncode(params[k])}`)
    .join("&");

  return [
    method.toUpperCase(),
    percentEncode(baseUrl),
    percentEncode(paramString),
  ].join("&");
}

export function computeSignature(
  baseString: string,
  consumerSecret: string,
  tokenSecret: string,
): string {
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;
  return createHmac("sha1", signingKey).update(baseString).digest("base64");
}

export function buildAuthorizationHeader(
  credentials: OAuthCredentials,
  method: string,
  url: string,
  queryParams?: Record<string, string>,
): string {
  const nonce = generateNonce();
  const timestamp = generateTimestamp();

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: credentials.consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: credentials.token,
    oauth_version: "1.0",
  };

  const allParams: Record<string, string> = {
    ...oauthParams,
    ...queryParams,
  };

  const baseString = buildSignatureBaseString(method, url, allParams);
  const signature = computeSignature(
    baseString,
    credentials.consumerSecret,
    credentials.tokenSecret,
  );

  oauthParams.oauth_signature = signature;

  const headerParts = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(", ");

  return `OAuth ${headerParts}`;
}
