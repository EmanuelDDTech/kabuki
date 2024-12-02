import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';
import type { Product } from '../interfaces';
import ProductAPI from '@/modules/product/api/ProductAPI';

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([]);

  // onMounted(async () => {
  //   await getProducts();
  // });

  const getProducts = async () => {
    const { data } = await ProductAPI.getAll();
    products.value = data;
  };

  return {
    products,

    // Methods
    getProducts,
  };
});
