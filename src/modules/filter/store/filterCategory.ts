import { defineStore } from 'pinia';
import { ref } from 'vue';
import FilterCategoryAPI from '../api/FilterCategoryAPI';

export const useFilterCategoryStore = defineStore('filterCategory', () => {
  const filters = ref([]);

  const findFilters = async (categId: number) => {
    const { data } = await FilterCategoryAPI.findAll(categId);
    filters.value = data;
  };

  return {
    filters,

    // Methods
    findFilters,
  };
});
