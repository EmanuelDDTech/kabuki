import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import FilterCategoryAPI from '../api/FilterCategoryAPI';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/modules/products/stores/products';
import type { FilterCategory } from '../interfaces';
import type { R } from 'node_modules/vuefire/dist/shared/vuefire.cc4a8ea4.mjs';

export const useFilterCategoryStore = defineStore('filterCategory', () => {
  const MAX_PRICE = 20000;

  const filters = ref<FilterCategory[]>([]);
  const activeFilters = ref<Record<string, string[]>>({});
  const existenceOnly = ref(false);

  const route = useRoute();
  const router = useRouter();

  const showFilters = ref(false);
  const minPrice = ref(0);
  const maxPrice = ref(MAX_PRICE);

  const isLoading = ref(false);

  const products = useProductsStore();

  let timer: ReturnType<typeof setTimeout>;

  const getFilters = async () => {
    const { existence, minPrice: min, maxPrice: max, ...query } = route.query;
    activeFilters.value = query;

    if (existence === 'true') existenceOnly.value = true;
    if (min) minPrice.value = parseInt(min);
    if (max) maxPrice.value = parseInt(max);
  };

  const findFilters = async (categId: number) => {
    isLoading.value = true;
    const { data } = await FilterCategoryAPI.findAll(categId);
    filters.value = data;
    isLoading.value = false;
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
    const queryParams = {
      ...activeFilters.value,
    };

    if (existenceOnly.value) {
      queryParams.existence = 'true';
    } else {
      delete queryParams.existence;
    }

    if (minPrice.value !== 0 || maxPrice.value !== MAX_PRICE) {
      queryParams.minPrice = minPrice.value;
      queryParams.maxPrice = maxPrice.value;
    } else {
      delete queryParams.minPrice;
      delete queryParams.maxPrice;
    }

    await router.push({
      query: queryParams,
    });
  };

  const getProducts = async () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      await products.getProductsWithFilters(createStringQuery.value);
    }, 50);
  };

  const createStringQuery = computed(() => {
    return window.location.href.split('?')[1];
  });

  const clearActiveFilters = () => {
    activeFilters.value = {};
  };

  const showFilterOptions = async () => {
    showFilters.value = true;
  };

  const hideFilterOptions = () => {
    showFilters.value = false;
  };

  const setPriceRange = async (e: any) => {
    minPrice.value = e['0'];
    maxPrice.value = e['1'];

    await updateURL();
  };

  watch(existenceOnly, async () => {
    await updateURL();
    await getProducts();
  });

  const getMaxPrice = () => {
    return MAX_PRICE;
  };

  return {
    filters,
    activeFilters,
    showFilters,
    existenceOnly,
    minPrice,
    maxPrice,
    activePriceFilter: computed(() => minPrice.value !== 0 || maxPrice.value !== MAX_PRICE),
    isLoading,

    // Methods
    getProducts,
    getFilters,
    findFilters,
    updateFilters,
    clearActiveFilters,
    showFilterOptions,
    hideFilterOptions,
    setPriceRange,

    // Getters
    getMaxPrice,
    createStringQuery,
  };
});
