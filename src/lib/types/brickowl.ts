export interface BrickOwlIdLookupResponse {
  boids: string[];
}

export interface BrickOwlPricingResponse {
  boid: string;
  new_avg: string | null;
  new_min: string | null;
  new_max: string | null;
  new_qty: number;
  used_avg: string | null;
  used_min: string | null;
  used_max: string | null;
  used_qty: number;
  currency_code: string;
}
