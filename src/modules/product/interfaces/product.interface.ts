import type { Ref } from 'vue';

export interface Product {
  id: Number;
  name: String;
  sku?: String;
  description?: String;
  price?: Number;
  discount?: Number;
  stock?: Number;
  product_category_id?: Number;
  createdAt?: Date;
  updatedAt?: Date;
  weight?: Number;
  product_galleries: ProductGallery[];
}

export interface ProductGallery {
  id?: Number;
  order?: Number;
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
  product_id?: Number;
}
