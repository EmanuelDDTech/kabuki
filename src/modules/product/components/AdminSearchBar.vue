<script lang="ts" setup>
import type { Product } from '../interfaces/product.interface';
import { useProductStore } from '../stores/product';

const product = useProductStore();

const emit = defineEmits(['addProduct']);

const addProduct = (productData: Product) => {
  emit('addProduct', productData);
  product.clearSearchQuery();
};
</script>

<template>
  <div class="relative mt-3">
    <div class="max-w-96 my-6">
      <FormKit
        type="search"
        placeholder="Buscar..."
        label="Añadir producto"
        v-model="product.searchQuery"
      />
    </div>

    <div
      v-if="product.searchedProducts.length > 0"
      class="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-2"
    >
      <ul class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <li
          v-for="product in product.searchedProducts"
          :key="product.id"
          @click="addProduct(product)"
          class="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition flex flex-col items-center"
        >
          <img
            :src="product.product_galleries[0].url"
            :alt="product.name"
            class="w-20 h-20 object-cover rounded-lg"
          />
          <span class="text-sm text-gray-700 mt-2 text-center">{{ product.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
