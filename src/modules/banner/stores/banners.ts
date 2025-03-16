import { defineStore } from 'pinia';
import { ref } from 'vue';
import useImage from '@/modules/products/composables/useImage';
import BannerAPI from '../api/BannerAPI';

const { deleteImage } = useImage();

export const useBannersStore = defineStore('banners', () => {
  const banners = ref([]);
  const isLoading = ref(true);

  const getBanners = async () => {
    isLoading.value = true;
    const { data } = await BannerAPI.getAll();
    banners.value = data;
    isLoading.value = false;
  };

  const deleteBanner = async (id: number, image: string) => {
    try {
      await deleteImage(image);
    } catch (error) {
      console.error(error);
    }

    try {
      await BannerAPI.delete(id);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    banners,
    isLoading,

    // Methods
    getBanners,
    deleteBanner,
  };
});
