import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import CategoryAPI from '../api/CategoryAPI';
import type { Category, FilterCategory, FilterGroup } from '../interfaces/category.interface';
import FilterCategoryAPI from '../api/FilterCategoryAPI';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[] | null>(null);
  const category = ref<Category>({
    id: 0,
    name: '',
  });
  const selectedFilters = ref<FilterCategory[]>([]);

  onMounted(async () => {
    await getCategories();
  });

  const categoryOptions = computed(() => {
    if (categories.value) {
      return categories.value.map((category: Category) => {
        return { label: category.name, value: category.id };
      });
    }
    return [];
  });

  const addFilterGroup = (group: FilterGroup) => {
    let exist = false;

    if (selectedFilters.value.length === 0) {
      selectedFilters.value?.push({ filter_group: group });
      return;
    }

    selectedFilters.value?.forEach((selectedFilter) => {
      if (selectedFilter.filter_group === group) {
        exist = true;
      }
    });

    if (!exist) {
      selectedFilters.value?.push({ filter_group: group });
    }
  };

  const cleanCategory = () => {
    category.value = {
      id: 0,
      name: '',
      filter_categories: [],
    };

    selectedFilters.value = [];
  };

  const getCategories = async () => {
    categories.value = await CategoryAPI.getAll();
  };

  const findCategory = async (id: number) => {
    category.value = await CategoryAPI.findOne(id);
    selectedFilters.value = await FilterCategoryAPI.findAll(id);
  };

  const deleteFilterCategory = async (group) => {
    if (group.id) {
      try {
        const result = await FilterCategoryAPI.delete(group.id);
        selectedFilters.value = selectedFilters.value.filter(
          (selectedFilter) => selectedFilter.id !== group.id,
        );
        return result;
      } catch (error) {
        console.log(error);
      }
    } else {
      selectedFilters.value = selectedFilters.value.filter(
        (selectedFilter) => selectedFilter.filter_group !== group.filter_group,
      );
    }
  };

  return {
    // Properties
    categories,
    category,
    selectedFilters,

    // Getters
    categoryOptions,

    // Actions
    addFilterGroup,
    cleanCategory,
    getCategories,
    findCategory,
    deleteFilterCategory,
  };
});
