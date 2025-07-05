import type { Product } from '@/modules/product/interfaces/product.interface';

export interface Cart {
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
