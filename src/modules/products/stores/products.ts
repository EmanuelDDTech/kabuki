import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import type { Product } from '../interfaces';
import ProductAPI from '@/modules/product/api/ProductAPI';
import productsAPI from '../api/productsAPI';

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  const isLoading = ref(true);

  // onMounted(async () => {
  //   await getProducts();
  // });

  const getProducts = async () => {
    isLoading.value = true;
    const { data } = await ProductAPI.getAll();
    products.value = data;
    isLoading.value = false;
  };

  const getProductsWithFilters = async (query: string) => {
    isLoading.value = true;
    const { data } = await productsAPI.findProducts(query);
    products.value = data;
    isLoading.value = false;
  };

  const clearProducts = () => {
    products.value = [];
  };

  const updateProduct = async (id: number, data: object) => {
    try {
      await ProductAPI.update(id, data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return {
    products,
    isLoading,

    // Methods
    getProducts,
    getProductsWithFilters,
    clearProducts,
    updateProduct,

    // Getters
    areProducts: computed(() => products.value.length > 0),
  };
});
