export type BrickLinkCondition = "N" | "U";

export interface BrickLinkApiResponse<T> {
  meta: {
    description: string;
    message: string;
    code: number;
  };
  data: T;
}

export interface BrickLinkPriceDetail {
  quantity: number;
  unit_price: string;
  shipping_available: boolean;
  seller_country_code: string;
  buyer_country_code: string;
  date_ordered: string;
}

export interface BrickLinkPriceGuide {
  item: {
    no: string;
    type: string;
  };
  new_or_used: BrickLinkCondition;
  currency_code: string;
  min_price: string;
  max_price: string;
  avg_price: string;
  qty_avg_price: string;
  unit_quantity: number;
  total_quantity: number;
  price_detail: BrickLinkPriceDetail[];
}
