<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import { useFilterCategoryStore } from '@/modules/filter/store/filterCategory';
import { useProductsStore } from '../stores/products';
import FilterIcon from '@/modules/common/icons/FilterIcon.vue';
import XMarkIcon from '@/modules/layouts/components/XMarkIcon.vue';

const filters = useFilterCategoryStore();
const products = useProductsStore();

onMounted(async () => {
  await filters.findFilters(1);
  await filters.getFilters();
});

onUnmounted(async () => {
  filters.clearActiveFilters();
  products.clearProducts();
});
</script>

<template>
  <div
    class="max-w-screen-xl mx-auto py-8 px-6 flex flex-col lg:flex-row gap-6 min-h-screen relative"
  >
    <section class="sticky top-0 z-10">
      <div class="flex-1 h-full hidden lg:inline-block">
        <div
          class="h-fit min-w-56 shadow-lg px-3 py-4 rounded-xl border border-gray-100 sticky top-0"
        >
          <h3 class="font-bold text-xl border-b border-b-gray-200 mb-3">Filtros</h3>

          <div v-for="filterGroup in filters.filters" :key="filterGroup.id">
            <h4 class="font-bold mb-1">{{ filterGroup.filter_group.name }}</h4>

            <div
              v-for="filterValue in filterGroup.filter_group.filter_values"
              :key="filterValue.id"
              :ref_for="filterValue.name"
              class="flex justify-between hover:bg-gray-100 py-1 px-2 rounded"
            >
              <label :for="filterValue.name" class="cursor-pointer">{{ filterValue.name }}</label>
              <input
                @change="filters.updateFilters(filterGroup.filter_group.slug, filterValue.slug)"
                :checked="
                  filters.activeFilters[filterGroup.filter_group.slug]?.includes(filterValue.slug)
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

      <div
        class="inline-block absolute top-2 lg:hidden shadow border border-gray-100 bg-white overflow-hidden"
      >
        <div
          class="my-3 px-4 transition-all"
          :class="
            !filters.showFilters
              ? 'max-w-32 max-h-[25px]'
              : 'max-w-[450px] max-h-[500px] overflow-scroll'
          "
        >
          <div class="flex justify-between w-60">
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

          <div class="mt-3">
            <!-- <div v-for="filterGroup in filters.filters" :key="filterGroup.id">
            <h4 class="font-bold mb-2">{{ filterGroup.filter_group.name }}</h4>

            <div class="flex flex-wrap gap-2 w-full max-w-96">
              <div
                v-for="filterValue in filterGroup.filter_group.filter_values"
                :key="filterValue.id"
                :ref_for="filterValue.name"
                class="inline-block w-fit justify-between py-1 px-2 rounded-full border cursor-pointer transition-colors text-sm"
                :class="
                  filters.activeFilters[filterGroup.filter_group.slug]?.includes(filterValue.slug)
                    ? 'bg-green-500 border-green-500'
                    : 'bg-none border-gray-300'
                "
                @click="filters.updateFilters(filterGroup.filter_group.slug, filterValue.slug)"
              >
                {{ filterValue.name }}
              </div>
            </div>
          </div> -->

            <div v-for="filterGroup in filters.filters" :key="filterGroup.id" class="w-60">
              <h4 class="font-bold mb-1">{{ filterGroup.filter_group.name }}</h4>

              <div
                v-for="filterValue in filterGroup.filter_group.filter_values"
                :key="filterValue.id"
                :ref_for="filterValue.name"
                class="flex justify-between hover:bg-gray-100 py-1 px-2 rounded"
              >
                <label :for="filterValue.name" class="cursor-pointer">{{ filterValue.name }}</label>
                <input
                  @change="filters.updateFilters(filterGroup.filter_group.slug, filterValue.slug)"
                  :checked="
                    filters.activeFilters[filterGroup.filter_group.slug]?.includes(filterValue.slug)
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
    </section>
    <section class="flex-1 mb-10 mt-16">
      <h1 class="text-2xl font-bold border-b border-b-gray-200 mb-6">Busqueda</h1>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(244px,1fr))] gap-4">
        <ProductCard
          v-for="product in products.products"
          :key="product.product_id"
          :product="product"
          class="mx-auto"
        />
      </div>
      <p v-if="!products.areProducts" class="text-center mt-4">
        No hay resultados. Intenta con otros filtros.
      </p>
    </section>
  </div>
</template>
