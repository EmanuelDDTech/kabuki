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
    const { data } = await ProductAPI.getAll();
    products.value = data;
  };

  const create = async (data: any) => {
    const { data: resultData } = await ProductAPI.create(data);
    product.value = resultData;
    return resultData;
  };

  return {
    // Properties
    products,
    product,

    // Getters
    // productList: computed(() => [...products.value]),
    imageExist: computed((product) => (product.product_galleries ? true : false)),
    getProducts,

    //Actions
    cleanProduct,
    addProduct,
    create,
  };
});
