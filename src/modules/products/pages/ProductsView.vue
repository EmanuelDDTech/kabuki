<script setup lang="ts">
import { onMounted } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import { useFilterCategoryStore } from '@/modules/filter/store/filterCategory';
import { useRoute } from 'vue-router';
import { useProductsStore } from '../stores/products';

const filters = useFilterCategoryStore();
const products = useProductsStore();

onMounted(async () => {
  await filters.findFilters(1);
});
</script>

<template>
  <div class="max-w-screen-xl mx-auto py-14 flex gap-6">
    <section class="flex flex-col">
      <div class="flex-1 inline-block h-full">
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
    </section>
    <section class="flex-1 mb-10">
      <h1 class="text-2xl font-bold border-b border-b-gray-200 mb-6">Busqueda</h1>
      <div class="grid grid-cols-4 gap-4">
        <ProductCard
          v-for="product in products.products"
          :key="product.product_id"
          :product="product"
        />
      </div>
    </section>
  </div>
</template>
