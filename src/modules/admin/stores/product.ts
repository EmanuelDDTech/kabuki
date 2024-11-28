import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import ProductAPI from '../api/ProductAPI';
import { useFilterCategoryStore } from '@/modules/filter/store/filterCategory';
import FilterValueProductAPI from '../api/FilterValueProductAPI';

const filterCategory = useFilterCategoryStore();

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

export const useProductStore = defineStore('product', () => {
  const id = ref(0);
  const name = ref('');
  const sku = ref('');
  const description = ref('');
  const price = ref(0);
  const discount = ref(0);
  const stock = ref(0);
  const product_category_id = ref(0);

  const gallery = ref([]);
  const filters = ref([]);
  // const deletedFilters = ref([]);

  const cleanProduct = () => {
    id.value = 0;
    name.value = '';
    sku.value = '';
    description.value = '';
    price.value = 0;
    discount.value = 0;
    stock.value = 0;
    product_category_id.value = 0;
    gallery.value = [];

    filters.value = [];
  };

  const create = async (data: any) => {
    const { data: resultData } = await ProductAPI.create(data);
    id.value = resultData.id;

    return resultData;
  };

  const selectFilter = (filterId: number) => {
    if (filters.value.includes(filterId)) {
      filters.value = filters.value.filter((filter) => filter !== filterId);
    } else {
      filters.value.push(filterId);
    }
  };

  const saveFilters = async () => {
    const data = {
      productId: id.value,
      filters: filters.value,
    };

    await FilterValueProductAPI.save(data);
  };

  const clearFilters = () => {
    filters.value = [];
  };

  watch(product_category_id, async () => {
    clearFilters();
    if (!product_category_id.value || product_category_id.value === 0) return;
    await filterCategory.findFilters(product_category_id.value);
  });

  return {
    // Properties
    id,
    name,
    sku,
    description,
    price,
    discount,
    stock,
    product_category_id,
    filters,

    // Getters
    // productList: computed(() => [...products.value]),
    imageExist: computed((product) => (product.product_galleries ? true : false)),

    //Actions
    cleanProduct,
    create,
    selectFilter,
    saveFilters,
    clearFilters,
  };
});
