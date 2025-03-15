import type { Ref } from 'vue';

export interface Product {
  id: number;
  name: string;
  sku?: string;
  active: boolean;
  description?: string;
  price?: number;
  discount?: number;
  stock?: number;
  product_category_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  weight?: number;
  product_galleries: ProductGallery[];
}

export interface ProductGallery {
  id?: number;
  order?: number;
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
  product_id?: number;
}
