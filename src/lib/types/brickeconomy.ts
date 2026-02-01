export interface BrickEconomySetValuation {
  set_number: string;
  name: string;
  year: number;
  retail_price: number | null;
  current_new_value: number | null;
  current_used_value: number | null;
  growth_percentage: number | null;
  annual_growth_percentage: number | null;
  currency: string;
}
