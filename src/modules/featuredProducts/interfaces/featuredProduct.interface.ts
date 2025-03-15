import type { Product } from '@/modules/product/interfaces/product.interface';

export interface FeaturedProduct {
  id: number;
  order: number;
  product: Product;
}
