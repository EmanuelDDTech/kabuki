import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import BannerAPI from '../api/BannerAPI';

export const useBannersStore = defineStore('banners', () => {
  const banners = ref([]);

  const getBanners = async () => {
    const { data } = await BannerAPI.getAll();
    banners.value = data;
  };

  return {
    banners,

    // Methods
    getBanners,
  };
});
