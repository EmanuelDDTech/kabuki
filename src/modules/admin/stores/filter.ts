import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';
import FilterGroupAPI from '../api/FilterGroupAPI';

export const useFilterStore = defineStore('filter', () => {
  const filterGroups = ref([]);

  onMounted(async () => {
    filterGroups.value = await FilterGroupAPI.getAll();
  });

  return {
    filterGroups,

    // Methods
  };
});
