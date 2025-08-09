import type { Product } from '@/modules/product/interfaces/product.interface';

export interface ProductResponse {
  data: Product[];
  nextPage?: number;
  hasNextPage: boolean;
}
