<script setup lang="ts">
import { useProductsCategory } from '@/composables/useProductsCategory';
import CartProduct from '../components/CartProduct.vue';
import SideBard from '../components/SideBard.vue';
import { useCartStore } from '../stores/cart';

const cart = useCartStore();
const { currentProductsCategory } = useProductsCategory();
</script>

<template>
  <main class="min-h-screen px-3 mb-8">
    <div class="max-w-screen-xl mx-auto block lg:flex gap-10 mt-8">
      <div class="flex-1">
        <section
          v-if="cart.isEmpty"
          class="flex-1 shadow-md border border-shori-gray-6 p-4 rounded-lg"
        >
          <h2 class="text-2xl font-bold border-b-2 border-shori-gray-6 pb-3">Carrito</h2>
          <p class="text-shori-gray-11 mt-6">
            No hay productos en el carrito.
            <router-link
              class="text-blue-600"
              :to="{ name: 'products', params: { category: currentProductsCategory } }"
            >
              Ver productos
            </router-link>
          </p>
        </section>

        <section v-else class="flex-1 shadow-md border border-shori-gray-6 p-4 rounded-lg">
          <h2 class="text-2xl font-bold border-b-2 border-shori-gray-6 pb-3">Carrito</h2>

          <CartProduct v-for="item in cart.items" :key="item.product.id" :item="item" />
        </section>
      </div>

      <SideBard checkout-step="cart" />
    </div>
  </main>
</template>
