import type { Ref } from 'vue';

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  product_category_id: number;
}
