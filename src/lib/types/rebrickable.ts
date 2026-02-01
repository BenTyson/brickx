export interface RebrickableTheme {
  id: number;
  parent_id: number | null;
  name: string;
}

export interface RebrickableSet {
  set_num: string;
  name: string;
  year: number;
  theme_id: number;
  num_parts: number;
  set_img_url: string | null;
  set_url: string;
  last_modified_dt: string;
}

export interface RebrickableColor {
  id: number;
  name: string;
  rgb: string;
  is_trans: boolean;
}

export interface RebrickablePart {
  part_num: string;
  name: string;
  part_cat_id: number;
  part_url: string;
  part_img_url: string | null;
}

export interface SetListParams {
  page?: number;
  page_size?: number;
  theme_id?: number;
  min_year?: number;
  max_year?: number;
  min_parts?: number;
  max_parts?: number;
  search?: string;
  ordering?: string;
}
