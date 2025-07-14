import type { User } from '@/modules/auth/interfaces';
import type { Product } from '@/modules/product/interfaces/product.interface';
import type { Delivery } from './delivery.interface';
import type { Address } from './address.interface';

export interface Sale {
  id: number;
  name?: string;
  state: State;
  address?: Address;
  require_payment: boolean;
  payment_method: string;
  amount_total: number;
  amount_subtotal: number;
  is_payed: boolean;
  invoice_required: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user_id: number;
  user?: User;
  sale_carts: SaleCart[];
  discount_amount: number;
  discount_code_id: number;
  amount_shipping: number;
  delivery_carrier_id: number;
  delivery_carrier?: Delivery;
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
  PAYPENDING = 'pago pendiente',
  PENDING = 'pendiente',
  COMPLETED = 'completado',
  CANCELED = 'cancelado',
}

export enum Period {
  DIA = 'Día',
  SEMANA = 'Semana',
  MES = 'Mes',
  AÑO = 'Año',
}
