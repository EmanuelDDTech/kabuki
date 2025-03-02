import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import FilterCategoryAPI from '../api/FilterCategoryAPI';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/modules/products/stores/products';

export const useFilterCategoryStore = defineStore('filterCategory', () => {
  const MAX_PRICE = 5000;

  const filters = ref([]);
  const activeFilters = ref({});
  const existenceOnly = ref(false);

  const route = useRoute();
  const router = useRouter();

  const products = useProductsStore();
  const showFilters = ref(false);
  const minPrice = ref(0);
  const maxPrice = ref(MAX_PRICE);

  // onMounted(async () => {
  //   console.log('Desde onMounted');
  //   activeFilters.value = { ...route.query };
  //   await getProducts();
  // });

  const getFilters = async () => {
    const { existence, minPrice: min, maxPrice: max, ...query } = route.query;
    activeFilters.value = query;

    if (existence === 'true') existenceOnly.value = true;
    if (min) minPrice.value = parseInt(min);
    if (max) maxPrice.value = parseInt(max);
  };

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
    await getProducts();
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

    // await getProducts();
  };

  const getProducts = async () => {
    console.log('Buscando...');
    await products.getProductsWithFilters(createStringQuery());
  };

  const createStringQuery = () => {
    return window.location.href.split('?')[1];
  };

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
  };
});
