<template>
  <article class="flex gap-3 my-6">
    <div class="w-40 p-3">
      <img src="@assets/img/producto.webp" alt="Imagen de producto" class="w-full" />
    </div>
    <div class="flex-1 flex flex-col justify-center">
      <h3 class="text-xl">League Battle Deck -Charizard ex- PREVENTA</h3>

      <div class="mt-3">
        <p class="font-bold mb-1">Cantidad:</p>
        <ProductQuantity :value="1" />
      </div>

      <div class="flex text-sm gap-6 mt-3 text-gray-500">
        <p class="cursor-pointer">Eliminar</p>
        <p class="cursor-pointer">Compartir</p>
      </div>
    </div>
    <div class="flex items-center">
      <p class="text-xl font-bold">$500.00</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import ProductQuantity from '@/modules/counter/components/ProductQuantity.vue';
</script>

<style scoped></style>
