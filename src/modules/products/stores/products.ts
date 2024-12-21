import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';
import type { Product } from '../interfaces';
import ProductAPI from '@/modules/product/api/ProductAPI';
import productsAPI from '../api/productsAPI';

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([]);

  // onMounted(async () => {
  //   await getProducts();
  // });

  const getProducts = async () => {
    const { data } = await ProductAPI.getAll();
    products.value = data;
  };

  const getProductsWithFilters = async (query: string) => {
    const { data } = await productsAPI.findProducts(query);
    products.value = data;
    console.log(products.value);
  };

  return {
    products,

    // Methods
    getProducts,
    getProductsWithFilters,
  };
});
