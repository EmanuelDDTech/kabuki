export interface DiscountCode {
  id?: number;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_purchase: number;
  max_discount: number;
  usage_limit: number;
  times_used: number;
  expires_at: Date;
}

export enum DiscountType {
  FIXED = 'fijo',
  PERCENTAGE = 'porcentaje',
}
