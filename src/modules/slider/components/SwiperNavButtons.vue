<template>
  <div class="flex-1 flex justify-end gap-3 text-gray-500">
    <button id="swiper-prev" @click="swiper.slidePrev()">
      <ArrowLeft
        class="w-11 h-8 p-1 border-2 border-gray-500 rounded cursor-pointer hover:bg-black hover:border-black hover:text-white transition-colors"
      />
    </button>
    <button id="swiper-next" @click="swiper.slideNext()">
      <ArrowRight
        class="w-11 h-8 p-1 border-2 border-gray-500 rounded cursor-pointer hover:bg-black hover:border-black hover:text-white transition-colors"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import ArrowLeft from '@/modules/icons/ArrowLeft.vue';
import ArrowRight from '@/modules/icons/ArrowRight.vue';
import { useSwiper } from 'swiper/vue';

const swiper = useSwiper();
</script>
