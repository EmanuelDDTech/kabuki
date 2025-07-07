<script lang="ts" setup>
import { useProductStore } from '@/modules/product/stores/product';
import ProductSearch from './ProductSearch.vue';
import { useRouter } from 'vue-router';

const product = useProductStore();
const router = useRouter();

defineEmits(['addProduct']);

const selectProduct = (id: number) => {
  product.findProduct(id);
  router.push({ name: 'product', params: { id: id } });
  product.clearSearchQuery();
};
</script>

<template>
  <div
    class="flex items-center max-w-lg bg-white text-gray-400 rounded-lg flex-1 border-2 border-gray-300"
  >
    <div class="border-r-2 border-gray-300">
      <!-- :class="(search.length > 0) ? 'bg-purple-500' : 'bg-gray-500 cursor-not-allowed'"
      :disabled="search.length == 0" -->
      <button
        type="submit"
        class="flex items-center justify-center w-9 aspect-square rounded-r-lg p-1"
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </button>
    </div>
    <div class="w-full">
      <input
        type="search"
        class="w-full px-4 py-1 text-gray-800 rounded-full focus:outline-none"
        placeholder="Buscar"
        v-model="product.searchQuery"
      />
    </div>

    <div
      v-if="product.searchedProducts.length > 0"
      class="w-screen max-w-7xl px-3 absolute bottom-0 left-1/2 translate-y-full -translate-x-1/2"
    >
      <div class="p-3 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
        <div
          class="w-full max-h-[600px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          <ul class="grid grid-cols-[repeat(auto-fill,minmax(224px,288px))] gap-4 justify-center">
            <ProductSearch
              v-for="productData in product.searchedProducts"
              :key="productData.id"
              :product="productData"
              @select-product="selectProduct"
            ></ProductSearch>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
