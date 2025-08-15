<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, type LocationQueryValue } from 'vue-router';
import { useInfiniteQuery } from '@tanstack/vue-query';

import { useSeoMeta } from '@unhead/vue';

import { useProductsStore } from '../stores/products';
import { useFilterCategoryStore } from '@/modules/filter/store/filterCategory';

import ProductCard from '../components/ProductCard.vue';
import FiltersSkeleton from '@/modules/filter/components/FiltersSkeleton.vue';

import XMarkIcon from '@/modules/layouts/components/XMarkIcon.vue';
import FilterIcon from '@/modules/common/icons/FilterIcon.vue';
import ChevronDownIcon from '@/modules/common/icons/ChevronDownIcon.vue';

import type { ProductResponse } from '../interfaces';
import LoaderWithText from '@/modules/common/components/LoaderWithText.vue';

const filters = useFilterCategoryStore();
const products = useProductsStore();

const priceRange = ref();

const route = useRoute();

onBeforeMount(async () => {
  await filters.findFilters(1);
  await filters.getFilters();
  priceRange.value.update([filters.minPrice, filters.maxPrice]);
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

const setPriceRange = async (e: any) => {
  await filters.setPriceRange(e);
};

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
  useInfiniteQuery<ProductResponse>({
    queryKey: computed(() => ['products', route.fullPath]),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return products.getProductsWithFilters(
        `${filters.createStringQuery}${pageParam ? `&page=${pageParam}` : ''}&limit=12&active=true`,
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
    <div
      class="max-w-screen-xl mx-auto py-8 px-6 flex flex-col lg:flex-row gap-6 min-h-screen relative"
    >
      <section class="sticky top-6 z-10">
        <div class="flex-1 h-full hidden lg:inline-block">
          <div class="h-fit min-w-60 shadow-lg py-4 rounded-xl border border-gray-100 sticky top-6">
            <h3 class="font-bold text-xl border-b border-b-gray-200 mb-3 px-3">Filtros</h3>

            <div
              class="max-h-[600px] overflow-y-scroll overflow-x-hidden px-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            >
              <div
                class="flex justify-between items-center py-1 px-2 mb-3 hover:bg-gray-100 rounded"
              >
                <label for="existenceOnly" class="cursor-pointer leading-none"
                  >Solo con existencia</label
                >
                <input
                  id="existenceOnly"
                  type="checkbox"
                  v-model="filters.existenceOnly"
                  class="cursor-pointer"
                />
              </div>

              <div>
                <label for="price" class="font-bold">Precio</label>
                <Vueform class="pl-3 pr-6">
                  <SliderElement
                    @change="setPriceRange"
                    ref="priceRange"
                    name="price"
                    :format="{
                      prefix: '$',
                      thousand: ' ',
                    }"
                    :step="100"
                    :min="0"
                    :max="filters.getMaxPrice()"
                    :default="[filters.minPrice, filters.maxPrice]"
                    class="mt-8"
                  />
                </Vueform>
              </div>

              <div v-if="filters.isLoading">
                <FiltersSkeleton v-for="i in 2" :key="i" />
              </div>

              <div v-for="filterGroup in filters.filters" :key="filterGroup.id" class="mt-4">
                <details class="group">
                  <summary class="flex justify-between items-center cursor-pointer">
                    <h4 class="font-bold mb-1 cursor-pointer">
                      {{ filterGroup.filter_group.name }}
                    </h4>
                    <ChevronDownIcon class="w-6 h-6 group-open:rotate-180 transition-transform" />
                  </summary>

                  <div
                    v-for="filterValue in filterGroup.filter_group.filter_values"
                    :key="filterValue.id"
                    class="flex text-sm justify-between items-center hover:bg-gray-100 py-1 px-2 rounded"
                  >
                    <label :for="filterValue.name" class="cursor-pointer leading-none">{{
                      filterValue.name
                    }}</label>
                    <input
                      @change="
                        filters.updateFilters(filterGroup.filter_group.slug, filterValue.slug)
                      "
                      :checked="
                        filters.activeFilters[filterGroup.filter_group.slug]?.includes(
                          filterValue.slug,
                        )
                          ? true
                          : false
                      "
                      type="checkbox"
                      :id="filterValue.name"
                      class="cursor-pointer"
                    />
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        <div class="flex lg:hidden min-h-12 items-center">
          <div
            class="inline-block absolute top-0 shadow border border-gray-100 bg-white overflow-hidden"
          >
            <div
              class="mb-3 transition-all"
              :class="
                !filters.showFilters
                  ? 'max-h-[40px]'
                  : 'max-w-[450px] max-h-[500px] overflow-scroll'
              "
            >
              <div
                class="flex justify-between w-full mb-3 py-3 px-4 sticky top-0 bg-white z-10 shadow"
              >
                <div class="flex gap-2 items-center" @click="filters.showFilterOptions()">
                  <h3 class="font-bold text-xl">Filtros</h3>
                  <FilterIcon class="h-6 w-6" />
                </div>
                <XMarkIcon
                  v-if="filters.showFilters"
                  @click="filters.hideFilterOptions()"
                  class="h-6 w-6 text-gray-400 top-2 right-4"
                />
              </div>

              <div class="px-4">
                <div class="flex justify-between items-center py-1 px-2 mb-3 rounded">
                  <label for="existenceOnly" class="cursor-pointer leading-none"
                    >Solo con existencia</label
                  >
                  <input
                    id="existenceOnly"
                    type="checkbox"
                    v-model="filters.existenceOnly"
                    class="cursor-pointer"
                  />
                </div>

                <div class="flex flex-col items-center">
                  <label for="price" class="font-bold self-start">Precio</label>
                  <Vueform>
                    <SliderElement
                      @change="setPriceRange"
                      ref="priceRange"
                      name="price"
                      :format="{
                        prefix: '$',
                        thousand: ' ',
                      }"
                      :step="100"
                      :min="0"
                      :max="filters.getMaxPrice()"
                      class="mt-8 w-52"
                    />
                  </Vueform>
                </div>

                <div class="mt-3 flex flex-col gap-3">
                  <div v-for="filterGroup in filters.filters" :key="filterGroup.id" class="w-60">
                    <h4 class="font-bold mb-1">{{ filterGroup.filter_group.name }}</h4>

                    <div
                      v-for="filterValue in filterGroup.filter_group.filter_values"
                      :key="filterValue.id"
                      class="flex justify-between hover:bg-gray-100 py-1 px-2 rounded"
                    >
                      <label :for="filterValue.name" class="cursor-pointer">{{
                        filterValue.name
                      }}</label>
                      <input
                        @change="
                          filters.updateFilters(filterGroup.filter_group.slug, filterValue.slug)
                        "
                        :checked="
                          filters.activeFilters[filterGroup.filter_group.slug]?.includes(
                            filterValue.slug,
                          )
                            ? true
                            : false
                        "
                        type="checkbox"
                        :id="filterValue.name"
                        class="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="flex-1 mb-10">
        <h1 class="text-2xl font-bold border-b border-b-gray-200 mb-6">Busqueda</h1>

        <LoaderWithText v-if="status === 'pending'" text="Cargando " />
        <div v-if="status === 'error'" class="text-center">Error al cargar</div>

        <div class="grid grid-cols-[repeat(auto-fill,minmax(244px,1fr))] gap-4">
          <ProductCard
            v-for="product in data?.pages.flatMap((page) => page.data)"
            :key="product.id"
            :product="product"
            class="mx-auto"
          />
        </div>

        <div ref="loadMoreProductsRef" style="height: 1px"></div>

        <LoaderWithText v-if="isFetchingNextPage" text="Cargando más" />
        <div v-else-if="!hasNextPage" class="mt-6 text-center">No hay más productos</div>
      </section>
    </div>
  </div>
</template>

<style scoped>
details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}
</style>
