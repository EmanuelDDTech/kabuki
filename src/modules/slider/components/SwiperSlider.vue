<template>
  <div>
    <header class="flex mb-6">
      <h2 class="text-4xl font-bold">Preventa</h2>

      <div class="flex-1 flex justify-end gap-3 text-gray-500">
        <button id="swiper-prev" @click="slidePrev()">
          <ArrowLeft
            class="w-11 h-8 p-1 border-2 border-gray-500 rounded cursor-pointer hover:bg-black hover:border-black hover:text-white transition-colors"
          />
        </button>
        <button id="swiper-next" @click="slideNext()">
          <ArrowRight
            class="w-11 h-8 p-1 border-2 border-gray-500 rounded cursor-pointer hover:bg-black hover:border-black hover:text-white transition-colors"
          />
        </button>
      </div>
    </header>

    <Swiper
      :modules="modules"
      :spaceBetween="20"
      :slidesPerView="5"
      :slidesPerGroup="1"
      :onSwiper="handleSwiperInit"
      navigation
      :breakpoints="{
        // when window width is >= 320px
        0: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        500: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        // when window width is >= 480px
        750: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        // when window width is >= 640px
        950: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        1180: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      }"
      :loop="true"
    >
      <SwiperSlide>
        <ProductCard />
      </SwiperSlide>
      <SwiperSlide>
        <ProductCard />
      </SwiperSlide>
      <SwiperSlide>
        <ProductCard />
      </SwiperSlide>
      <SwiperSlide>
        <ProductCard />
      </SwiperSlide>
      <SwiperSlide>
        <ProductCard />
      </SwiperSlide>
      <SwiperSlide>
        <ProductCard />
      </SwiperSlide>
      <SwiperSlide>
        <ProductCard />
      </SwiperSlide>
      <SwiperSlide>
        <ProductCard />
      </SwiperSlide>
      <SwiperSlide>
        <ProductCard />
      </SwiperSlide>
      <SwiperSlide>
        <ProductCard />
      </SwiperSlide>
      <SwiperSlide>
        <ProductCard />
      </SwiperSlide>
      <SwiperSlide>
        <ProductCard />
      </SwiperSlide>
      <SwiperSlide>
        <ProductCard />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/vue';
import ProductCard from '@/modules/products/components/ProductCard.vue';
import ArrowLeft from '@/modules/icons/ArrowLeft.vue';
import ArrowRight from '@/modules/icons/ArrowRight.vue';
import type { SwiperClass } from 'swiper/react';
import { ref } from 'vue';

const modules = [Pagination, Navigation];

const swiper = ref<SwiperClass | null>(null);

// interface Props {

// }

// defineProps({
//   products: {
//     type: Array,
//     required: true,
//   }
// })
function handleSwiperInit(swiperInstance: SwiperClass) {
  swiper.value = swiperInstance;
}

function slideNext() {
  if (swiper.value) {
    swiper.value.slideNext();
  }
}

function slidePrev() {
  if (swiper.value) {
    swiper.value.slidePrev();
  }
}
</script>

<style scoped>
.swiper {
  padding: 12px 0;
  overflow: hidden;
}

.swiper-slide {
  display: flex;
  justify-content: center;
}
</style>
