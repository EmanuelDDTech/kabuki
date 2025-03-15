import featuredProductAPI from '@/modules/featuredProducts/api/featuredProductAPI';
import type { FeaturedProduct } from '@/modules/featuredProducts/interfaces/featuredProduct.interface';
import type { Product } from '@/modules/product/interfaces/product.interface';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFeaturedProductStore = defineStore('featured-product', () => {
  const featuredProducts = ref<FeaturedProduct[]>([]);
  const isLoading = ref(false);

  const getFeaturedProducts = async () => {
    try {
      isLoading.value = true;
      const { data } = await featuredProductAPI.getAll();

      featuredProducts.value = data;
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  };

  const addFeaturedProduct = async (product: Product) => {
    const featuredProductData = {
      order: featuredProducts.value.length,
      product_id: product.id,
    };

    try {
      await featuredProductAPI.create(featuredProductData);
      await getFeaturedProducts();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const deleteFeaturedProduct = async (id: number) => {
    try {
      await featuredProductAPI.delete(id);
      await getFeaturedProducts();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateFeaturedProducts = async (oldIndex: number, newIndex: number) => {
    isLoading.value = true;
    try {
      const delta = oldIndex - newIndex > 0 ? -1 : 1;
      console.log(delta);

      for (let i = oldIndex; i !== newIndex; i += delta) {
        await featuredProductAPI.update(featuredProducts.value[i + delta].id, i);
      }

      await featuredProductAPI.update(featuredProducts.value[oldIndex].id, newIndex);
      await getFeaturedProducts();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    featuredProducts,
    isLoading,

    // Methods
    getFeaturedProducts,
    addFeaturedProduct,
    deleteFeaturedProduct,
    updateFeaturedProducts,

    // Getters
  };
});
