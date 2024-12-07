import { defineStore } from 'pinia';
import { ref } from 'vue';
import useImage from '@/modules/products/composables/useImage';
import BannerAPI from '../api/BannerAPI';

const { deleteImage } = useImage();

export const useBannersStore = defineStore('banners', () => {
  const banners = ref([]);

  const getBanners = async () => {
    const { data } = await BannerAPI.getAll();
    banners.value = data;
  };

  const deleteBanner = async (id: number, image: string) => {
    await deleteImage(image);
    await BannerAPI.delete(id);
  };

  return {
    banners,

    // Methods
    getBanners,
    deleteBanner,
  };
});
