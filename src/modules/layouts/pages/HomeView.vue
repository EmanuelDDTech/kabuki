<script setup lang="ts">
import ArrowLeft from '@/modules/icons/ArrowLeft.vue';
import ArrowRight from '@/modules/icons/ArrowRight.vue';
import ProductCard from '@/modules/products/components/ProductCard.vue';
import SwiperSlider from '@/modules/slider/components/SwiperSlider.vue';
</script>

<template>
  <main>
    <section class="bg-gray-100 px-3">
      <div class="max-w-screen-xl mx-auto py-14">
        <SwiperSlider />
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
