import { computed } from 'vue';
import { useRoute } from 'vue-router';

export const PRODUCT_CATEGORIES = ['pokemon', 'magic', 'riftbound', 'otros'] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export const DEFAULT_PRODUCTS_CATEGORY: ProductCategory = 'pokemon';
export const DEFAULT_PRODUCTS_CATEGORY_ID = 6;

export const PRODUCT_CATEGORY_ID_MAP: Record<ProductCategory, number> = {
  pokemon: 1,
  magic: 3,
  riftbound: 4,
  otros: 6,
};

const isProductCategory = (value: unknown): value is ProductCategory => {
  return typeof value === 'string' && PRODUCT_CATEGORIES.includes(value as ProductCategory);
};

export const getProductsCategoryId = (value: unknown): number => {
  if (isProductCategory(value)) {
    return PRODUCT_CATEGORY_ID_MAP[value];
  }

  return DEFAULT_PRODUCTS_CATEGORY_ID;
};

export const useProductsCategory = () => {
  const route = useRoute();

  const currentProductsCategory = computed<ProductCategory>(() => {
    const category = route.params.category;

    if (isProductCategory(category)) {
      return category;
    }

    return DEFAULT_PRODUCTS_CATEGORY;
  });

  const currentProductsCategoryId = computed<number>(() => {
    return getProductsCategoryId(route.params.category);
  });

  return {
    currentProductsCategory,
    currentProductsCategoryId,
  };
};
