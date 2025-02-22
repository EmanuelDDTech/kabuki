export interface Delivery {
  id: number;
  name: string;
  active: boolean;
  fized_price: number;
  servicelevel: string;
  free_over: boolean;
  image: string;
  delivery_price_rules: DeliveryRule[];
}

export interface DeliveryRule {
  id: number;
  carrier_id: number;
  max_value: number;
  list_base_price: number;
}
