<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, type LocationQueryValue } from 'vue-router';
import { useInfiniteQuery } from '@tanstack/vue-query';

import { useSeoMeta } from '@unhead/vue';

import { useProductsStore } from '../stores/products';
import { useFilterCategoryStore } from '@/modules/filter/store/filterCategory';

import ProductCard from '../components/ProductCard.vue';
import ProductList from '../components/ProductList.vue';

import type { ProductResponse } from '../interfaces';
import LoaderWithText from '@/modules/common/components/LoaderWithText.vue';
import ProductsFiltersTopBar from '@/modules/filter/components/ProductsFiltersTopBar.vue';
import { getProductsCategoryId } from '@/composables/useProductsCategory';

const filters = useFilterCategoryStore();
const products = useProductsStore();

const route = useRoute();
const currentProductsCategoryId = computed(() => getProductsCategoryId(route.params.category));

onBeforeMount(async () => {
  await filters.findFilters(currentProductsCategoryId.value);
  await filters.getFilters();
});

watch(currentProductsCategoryId, async (newId) => {
  await filters.findFilters(newId);
  await filters.getFilters();
});

const formatExpansion = (expansion: LocationQueryValue) => {
  return expansion
    ?.toString()
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

useSeoMeta({
  title: () =>
    `Productos Pokémon TCG | ShoriKameCards ${
      route.query.expansion && route.query.expansion.length !== 0
        ? `| Expansión: ${Array.isArray(route.query.expansion) ? route.query.expansion.map(formatExpansion).join(', ') : formatExpansion(route.query.expansion)}`
        : ''
    } ${route.query['tipo-de-producto'] && route.query['tipo-de-producto'].length !== 0 ? `| ${Array.isArray(route.query['tipo-de-producto']) ? route.query['tipo-de-producto'].map(formatExpansion).join(', ') : formatExpansion(route.query['tipo-de-producto'])}` : ''}`,
  ogTitle: () =>
    `Productos Pokémon TCG | ShoriKameCards ${
      route.query.expansion && route.query.expansion.length !== 0
        ? `| Expansión: ${Array.isArray(route.query.expansion) ? route.query.expansion.map(formatExpansion).join(', ') : formatExpansion(route.query.expansion)}`
        : ''
    } ${route.query['tipo-de-producto'] && route.query['tipo-de-producto'].length !== 0 ? `| ${Array.isArray(route.query['tipo-de-producto']) ? route.query['tipo-de-producto'].map(formatExpansion).join(', ') : formatExpansion(route.query['tipo-de-producto'])}` : ''}`,
  description: () =>
    `Explora todos nuestros productos Pokémon TCG ${
      route.query.expansion && route.query.expansion.length !== 0
        ? `| Expansión: ${Array.isArray(route.query.expansion) ? route.query.expansion.map(formatExpansion).join(', ') : formatExpansion(route.query.expansion)}`
        : ''
    } ${route.query['tipo-de-producto'] && route.query['tipo-de-producto'].length !== 0 ? `| ${Array.isArray(route.query['tipo-de-producto']) ? route.query['tipo-de-producto'].map(formatExpansion).join(', ') : formatExpansion(route.query['tipo-de-producto'])}` : ''}`,
  ogDescription: () =>
    `Explora todos nuestros productos Pokémon TCG ${
      route.query.expansion && route.query.expansion.length !== 0
        ? `| Expansión: ${Array.isArray(route.query.expansion) ? route.query.expansion.map(formatExpansion).join(', ') : formatExpansion(route.query.expansion)}`
        : ''
    } ${route.query['tipo-de-producto'] && route.query['tipo-de-producto'].length !== 0 ? `| ${Array.isArray(route.query['tipo-de-producto']) ? route.query['tipo-de-producto'].map(formatExpansion).join(', ') : formatExpansion(route.query['tipo-de-producto'])}` : ''}`,
  // ogImage: () => product.gallery[0]?.url,
  // ogImageHeight: '1000',
  // ogImageWidth: '1000',
  // ogImageType: 'image/png',
  ogUrl: `https://shorikamecards.com${route.fullPath}`,
});

onUnmounted(async () => {
  filters.clearActiveFilters();
  products.clearProducts();
});

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
  useInfiniteQuery<ProductResponse>({
    queryKey: computed(() => ['products', route.fullPath]),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return products.getProductsWithFilters(
        `${filters.createStringQuery}${pageParam ? `&page=${pageParam}` : ''}&limit=12&active=true`,
        currentProductsCategoryId.value,
      );
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ? lastPage.nextPage : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

const loadMoreProductsRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
        fetchNextPage();
      }
    },
    {
      rootMargin: '100px',
    },
  );

  if (loadMoreProductsRef.value) {
    observer.observe(loadMoreProductsRef.value);
  }
});

onBeforeUnmount(() => {
  if (observer && loadMoreProductsRef.value) {
    observer.unobserve(loadMoreProductsRef.value);
  }
});
</script>

<template>
  <div class="w-full">
    <div class="mx-auto min-h-screen max-w-screen-xl px-6 pb-8">
      <section class="mb-10">
        <h1 class="text-2xl font-bold border-b border-b-shori-gray-6 mb-6">Busqueda</h1>
        <ProductsFiltersTopBar />

        <LoaderWithText v-if="status === 'pending'" text="Cargando " />
        <div v-if="status === 'error'" class="text-center">Error al cargar</div>

        <ProductList :items="data?.pages.flatMap((page) => page.data) ?? []">
          <template #item="{ item }">
            <ProductCard :product="item" class="mx-auto" />
          </template>
        </ProductList>

        <div ref="loadMoreProductsRef" style="height: 1px"></div>

        <LoaderWithText v-if="isFetchingNextPage" text="Cargando más" />
        <div v-else-if="!hasNextPage" class="mt-6 text-center">No hay más productos</div>
      </section>
    </div>
  </div>
</template>
