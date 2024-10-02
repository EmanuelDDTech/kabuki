<template>
  <main class="min-h-screen px-3">
    <div class="max-w-screen-xl mx-auto flex gap-10 mt-8">
      <div class="flex-1 shadow-md border border-gray-100 p-4 rounded-lg">
        <h2 class="text-2xl font-bold border-b-2 border-gray-200 pb-3">Carrito</h2>

        <CartProduct />
        <CartProduct />
        <CartProduct />
      </div>
      <aside class="w-72 h-fit shadow-md border border-gray-100 p-4 rounded-lg">
        <h3 class="text-xl">Subtotal: <span class="font-bold">$1000.00</span></h3>
        <RouterLink
          :to="{ name: 'pay' }"
          class="block text-center w-full rounded-full bg-yellow-300 py-1 mt-3 text-sm"
          >Pagar</RouterLink
        >
      </aside>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import CartProduct from '../components/CartProduct.vue';
</script>

<style scoped></style>
