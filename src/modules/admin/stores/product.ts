import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import type { Product } from '../interfaces/product.interface';
import ProductAPI from '../api/ProductAPI';

const initialProductValues = {
  id: 0,
  name: '',
  sku: '',
  description: '',
  price: 0,
  image: 'URL de la imagen del product',
  discount: 0,
  stock: 0,
  product_category_id: 0,
};

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  const product = ref<Product>(initialProductValues);

  onMounted(async () => {
    await getProducts();
  });

  const cleanProduct = () => {
    product.value = initialProductValues;
  };

  const addProduct = (product: Product) => {
    products.value.push(product);
  };

  const getProducts = async () => {
    products.value = await ProductAPI.getAll();
  };

  return {
    // Properties
    products,
    product,

    // Getters
    // productList: computed(() => [...products.value]),

    //Actions
    cleanProduct,
    addProduct,
  };
});
