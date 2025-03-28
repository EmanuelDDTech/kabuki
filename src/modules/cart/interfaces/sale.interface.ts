import type { Product } from '@/modules/product/interfaces/product.interface';

export interface Sale {
  id: Number;
  name?: String;
  state: State;
  require_payment: Boolean;
  amount_total: Number;
  is_payed: Boolean;
  invoice_required: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user_id: Number;
  sale_carts: SaleCart[];
}

export interface SaleCart {
  id?: Number;
  quantity: Number;
  price_unit: Number;
  subtotal: Number;
  createdAt?: Date;
  updatedAt?: Date;
  productId?: Number;
  saleOrderId?: Number;
  product: Product;
}

export enum State {
  PENDING = 'pendiente',
  COMPLETED = 'completado',
  CANCELED = 'cancelado',
  PAYPENDING = 'pago pendiente',
}
