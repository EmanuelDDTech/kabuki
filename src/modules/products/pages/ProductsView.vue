<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import { useFilterCategoryStore } from '@/modules/filter/store/filterCategory';
import { useProductsStore } from '../stores/products';
import FilterIcon from '@/modules/common/icons/FilterIcon.vue';
import XMarkIcon from '@/modules/layouts/components/XMarkIcon.vue';
import FiltersSkeleton from '@/modules/filter/components/FiltersSkeleton.vue';
import ProductSkeleton from '../components/ProductSkeleton.vue';

const filters = useFilterCategoryStore();
const products = useProductsStore();

const priceRange = ref();

onBeforeMount(async () => {
  await filters.findFilters(1);
});

onMounted(async () => {
  await filters.findFilters(1);
  await filters.getFilters();

  if (filters.activePriceFilter) {
    priceRange.value.update([filters.minPrice, filters.maxPrice]);
  } else if (!filters.existenceOnly) {
    await filters.getProducts();
  }
});

onUnmounted(async () => {
  filters.clearActiveFilters();
  products.clearProducts();
});

const setPriceRange = async (e: any) => {
  await filters.setPriceRange(e);
  await filters.getProducts();
};
</script>

<template>
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
            <div class="flex justify-between items-center py-1 px-2 mb-3 hover:bg-gray-100 rounded">
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
                  :max="parseInt(filters.getMaxPrice())"
                  :default="[filters.minPrice, filters.maxPrice]"
                  class="mt-8"
                />
              </Vueform>
            </div>

            <div v-if="filters.isLoading">
              <FiltersSkeleton v-for="i in 2" :key="i" />
            </div>

            <div v-for="filterGroup in filters.filters" :key="filterGroup.id" class="mt-4">
              <h4 class="font-bold mb-1">{{ filterGroup.filter_group.name }}</h4>

              <div
                v-for="filterValue in filterGroup.filter_group.filter_values"
                :key="filterValue.id"
                :ref_for="filterValue.name"
                class="flex text-sm justify-between items-center hover:bg-gray-100 py-1 px-2 rounded"
              >
                <label :for="filterValue.name" class="cursor-pointer leading-none">{{
                  filterValue.name
                }}</label>
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

      <div class="flex lg:hidden min-h-12 items-center">
        <div
          class="inline-block absolute top-0 shadow border border-gray-100 bg-white overflow-hidden"
        >
          <div
            class="mb-3 transition-all"
            :class="
              !filters.showFilters ? 'max-h-[40px]' : 'max-w-[450px] max-h-[500px] overflow-scroll'
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
                    :max="parseInt(filters.getMaxPrice())"
                    :default="[filters.minPrice, filters.maxPrice]"
                    class="mt-8 w-52"
                  />
                </Vueform>
              </div>

              <div class="mt-3 flex flex-col gap-3">
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
      <div
        v-if="products.isLoading"
        class="grid grid-cols-[repeat(auto-fill,minmax(244px,1fr))] gap-4"
      >
        <ProductSkeleton v-for="i in 6" :key="i" />
      </div>
      <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(244px,1fr))] gap-4">
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
