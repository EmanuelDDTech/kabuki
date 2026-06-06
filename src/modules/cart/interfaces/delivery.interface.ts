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
}
