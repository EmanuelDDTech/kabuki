import { defineStore } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import FilterCategoryAPI from '../api/FilterCategoryAPI';
import { useRoute, useRouter } from 'vue-router';
import { parseJSON } from 'date-fns';
import { useProductsStore } from '@/modules/products/stores/products';

export const useFilterCategoryStore = defineStore('filterCategory', () => {
  const filters = ref([]);
  const activeFilters = ref({});

  const route = useRoute();
  const router = useRouter();

  const products = useProductsStore();

  onMounted(async () => {
    activeFilters.value = { ...route.query };
    await getProducts();
  });

  const findFilters = async (categId: number) => {
    const { data } = await FilterCategoryAPI.findAll(categId);
    filters.value = data;
  };

  const updateFilters = async (filterGroupSlug, filterValueSlug) => {
    if (activeFilters.value[filterGroupSlug]) {
      activeFilters.value[filterGroupSlug] = Array.isArray(activeFilters.value[filterGroupSlug])
        ? activeFilters.value[filterGroupSlug]
        : activeFilters.value[filterGroupSlug].split(' ');

      if (activeFilters.value[filterGroupSlug].includes(filterValueSlug)) {
        activeFilters.value[filterGroupSlug] = activeFilters.value[filterGroupSlug].filter(
          (filter) => filter !== filterValueSlug,
        );
      } else {
        activeFilters.value[filterGroupSlug].push(filterValueSlug);
      }
    } else {
      activeFilters.value[filterGroupSlug] = [filterValueSlug];
    }

    await updateURL();
  };

  const updateURL = async () => {
    await router.push({
      query: {
        ...route.query,
        ...activeFilters.value,
      },
    });

    await getProducts();
  };

  const getProducts = async () => {
    await products.getProductsWithFilters(createStringQuery());
  };

  const createStringQuery = () => {
    return window.location.href.split('?')[1];
  };

  return {
    filters,
    activeFilters,

    // Methods
    findFilters,
    updateFilters,
  };
});
