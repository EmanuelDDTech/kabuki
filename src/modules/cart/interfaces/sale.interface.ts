import type { Product } from '@/modules/product/interfaces/product.interface';

export interface Sale {
  id: number;
  name?: string;
  state: State;
  require_payment: boolean;
  amount_total: number;
  amount_subtotal: number;
  is_payed: boolean;
  invoice_required: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user_id: number;
  sale_carts: SaleCart[];
  discount_amount: number;
  discount_code_id: number;
  amount_shipping: number;
}

export interface SaleCart {
  id?: number;
  quantity: number;
  price_unit: number;
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
  productId?: number;
  saleOrderId?: number;
  product: Product;
}

export enum State {
  PENDING = 'pendiente',
  COMPLETED = 'completado',
  CANCELED = 'cancelado',
  PAYPENDING = 'pago pendiente',
}
