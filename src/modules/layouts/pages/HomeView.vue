<script setup lang="ts">
import ArrowLeft from '@/modules/icons/ArrowLeft.vue';
import ArrowRight from '@/modules/icons/ArrowRight.vue';
import ProductCard from '@/modules/products/components/ProductCard.vue';
</script>

<template>
  <main>
    <section class="bg-gray-100 px-3">
      <div class="max-w-screen-xl mx-auto py-14">
        <header class="flex">
          <h2 class="text-3xl font-bold">Preventa</h2>
          
          <div class="flex-1 flex justify-end gap-3 text-gray-500">
            <ArrowLeft class="w-11 h-8 p-1 border-2 border-gray-500 rounded cursor-pointer hover:bg-black hover:border-black hover:text-white transition-colors"/>
            <ArrowRight class="w-11 h-8 p-1 border-2 border-gray-500 rounded cursor-pointer hover:bg-black hover:border-black hover:text-white transition-colors"/>
          </div>
        </header>

        <div class="flex gap-3 mt-6">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </section>
    <section class="px-3">
      <div class="max-w-screen-xl mx-auto py-8">
        <h2>Ofertas</h2>
      </div>
    </section>
    <section class="px-3">
      <div class="max-w-screen-xl mx-auto py-8">
        <h2>Producto Cerrado</h2>
      </div>
    </section>
  </main>
</template>
