export enum DeliveryCarrierType {
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP',
}

export interface Delivery {
  id: number;
  name: string;
  active: boolean;
  carrier_type: DeliveryCarrierType;
  fized_price: number;
  servicelevel: string;
  free_over: boolean;
  image: string;
  amount_shipping: number;
  delivery_price_rules: DeliveryRule[];
}

export interface DeliveryRule {
  id: number;
  carrier_id: number;
  max_value: number;
  list_base_price: number;
  pricing_source: 'TABLE' | 'API';
  is_active: boolean;
  priority: number;
  type: 'DELIVERY' | 'PICKUP';
}

export interface ShippingCarrier {
  id: number;
  name: string;
  pricing_type_id: number;
}

export interface ShippingCarrierPricingType {
  id: number;
  code: ShippingCarrierPricingTypeCode;
  description: string;
}

export enum ShippingCarrierPricingTypeCode {
  FIXED_PLUS_EXTRA = 'FIXED_PLUS_EXTRA',
  WEIGHT_RANGE = 'WEIGHT_RANGE',
  PER_KG = 'PER_KG',
}
