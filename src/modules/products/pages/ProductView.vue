<template>
  <main class="px-6">
    <section class="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-16 my-16">
      <div class="flex flex-col justify-center items-center gap-3 w-full lg:w-2/4">
        <swiper
          :style="{
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          }"
          :spaceBetween="10"
          :thumbs="{ swiper: thumbsSwiper }"
          :modules="modules"
          class="mySwiper2 w-full max-w-[640px]"
        >
          <swiper-slide class="bg-gray-200 rounded-lg cursor-pointer p-5 sm:p-10"
            ><img src="@assets/img/producto.webp" class="w-4/5" /></swiper-slide
          ><swiper-slide class="bg-gray-200 rounded-lg cursor-pointer p-5 sm:p-10"
            ><img src="@assets/img/producto.webp" class="w-4/5" /></swiper-slide
          ><swiper-slide class="bg-gray-200 rounded-lg cursor-pointer p-5 sm:p-10"
            ><img src="@assets/img/producto.webp" class="w-4/5" /></swiper-slide
          ><swiper-slide class="bg-gray-200 rounded-lg cursor-pointer p-5 sm:p-10"
            ><img src="@assets/img/producto.webp" class="w-4/5" /></swiper-slide
          ><swiper-slide class="bg-gray-200 rounded-lg cursor-pointer p-5 sm:p-10"
            ><img src="@assets/img/producto.webp" class="w-4/5"
          /></swiper-slide>
        </swiper>
        <swiper
          @swiper="setThumbsSwiper"
          :spaceBetween="10"
          :slidesPerView="5"
          :freeMode="true"
          :watchSlidesProgress="true"
          :modules="modules"
          class="mySwiper w-full max-w-[640px]"
        >
          <swiper-slide
            class="bg-gray-200 rounded-lg cursor-pointer p-1 sm:p-3 border-2 border-gray-200 hover:border-black transition-colors"
            ><img src="@assets/img/producto.webp" class="w-4/5" /></swiper-slide
          ><swiper-slide
            class="bg-gray-200 rounded-lg cursor-pointer p-1 sm:p-3 border-2 border-gray-200 hover:border-black transition-colors"
            ><img src="@assets/img/producto.webp" class="w-4/5" /></swiper-slide
          ><swiper-slide
            class="bg-gray-200 rounded-lg cursor-pointer p-1 sm:p-3 border-2 border-gray-200 hover:border-black transition-colors"
            ><img src="@assets/img/producto.webp" class="w-4/5" /></swiper-slide
          ><swiper-slide
            class="bg-gray-200 rounded-lg cursor-pointer p-1 sm:p-3 border-2 border-gray-200 hover:border-black transition-colors"
            ><img src="@assets/img/producto.webp" class="w-4/5" /></swiper-slide
          ><swiper-slide
            class="bg-gray-200 rounded-lg cursor-pointer p-1 sm:p-3 border-2 border-gray-200 hover:border-black transition-colors"
            ><img src="@assets/img/producto.webp" class="w-4/5"
          /></swiper-slide>
        </swiper>
      </div>
      <div>
        <h1 class="text-3xl font-semibold mb-3">League Battle Deck - Charizard ex</h1>
        <ul class="flex gap-7 items-center">
          <li>
            <div class="flex items-center">
              <svg
                class="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                ></path>
              </svg>
              <svg
                class="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                ></path>
              </svg>
              <svg
                class="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                ></path>
              </svg>
              <svg
                class="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                ></path>
              </svg>
              <svg
                class="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                ></path>
              </svg>
              <span
                class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ml-3"
                >5.0</span
              >
            </div>
          </li>
          <li class="list-disc">100 Reviews</li>
        </ul>

        <div class="mt-8">
          <p class="text-4xl font-bold">$272.00 MX</p>
          <div class="flex gap-3 items-end">
            <p class="text-xl text-gray-500 line-through font-normal mt-0">$340.00</p>
            <p class="text-xl text-green-600">20% descuento</p>
          </div>
        </div>

        <div class="mt-8">
          <h2 class="text-xl font-bold mb-3">Variantes</h2>

          <ul class="flex gap-3">
            <li
              class="w-24 aspect-square p-3 rounded-lg bg-gray-200 cursor-pointer border-2 border-gray-200 hover:border-black transition-colors"
            >
              <img src="@assets/img/producto.webp" alt="Product image" />
            </li>
            <li
              class="w-24 aspect-square p-3 rounded-lg bg-gray-200 cursor-pointer border-2 border-gray-200 hover:border-black transition-colors"
            >
              <img src="@assets/img/producto.webp" alt="Product image" />
            </li>
          </ul>
        </div>

        <div class="mt-10">
          <button
            class="w-full py-3 rounded-lg bg-black border-2 border-black text-white mb-3 font-bold hover:bg-gray-200 hover:text-black transition-colors"
          >
            Comprar ahora
          </button>
          <button
            class="w-full py-3 rounded-lg bg-white text-black border-2 border-black font-bold hover:bg-gray-200 hover:text-black transition-colors"
          >
            Agregar al carrito
          </button>
        </div>

        <div class="flex pl-4 font-normal mt-5 justify-center">
          <RouterLink
            :to="{ name: 'home' }"
            class="flex items-center gap-2 pr-4 border-r-2 border-gray-300 hover:text-blue-500 transition-colors"
          >
            <WishlistIcon class="h-6 aspect-square font-normal" />
            Favoritos</RouterLink
          >
          <RouterLink
            :to="{ name: 'home' }"
            class="flex items-center gap-2 pl-4 hover:text-blue-500 transition-colors"
          >
            <ShareIcon class="h-6 aspect-square font-normal" />
            Compartir</RouterLink
          >
        </div>
      </div>
    </section>
    <section class="max-w-screen-xl mx-auto mb-10">
      <h2 class="text-2xl font-bold mb-6">Detalles del producto</h2>

      <ul class="leading-6 text-gray-500">
        <li class="list-disc ml-4"><p>1 mazo de 60 cartas listo para jugar</p></li>
        <li class="list-disc ml-4"><p>6 dados para contar daños</p></li>
        <li class="list-disc ml-4"><p>1 dado para lanzar una moneda</p></li>
        <li class="list-disc ml-4"><p>2 marcadores de condición de las monedas</p></li>
        <li class="list-disc ml-4"><p>1 caja para el mazo</p></li>
        <li class="list-disc ml-4"><p>1 caja de accesorios</p></li>
        <li class="list-disc ml-4"><p>1 hoja de estrategia</p></li>
        <li class="list-disc ml-4"><p>1 tarjeta de código para jugar el mazo en línea</p></li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import WishlistIcon from '@/modules/cart/components/wishlistIcon.vue';
import ShareIcon from '../components/ShareIcon.vue';
import type { SwiperClass } from 'swiper/react';

const thumbsSwiper = ref<SwiperClass | null>(null);

const modules = [FreeMode, Navigation, Thumbs];

const setThumbsSwiper = (swiper: SwiperClass) => {
  thumbsSwiper.value = swiper;
};
</script>

<style scoped>
.mySwiper2 .swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mySwiper .swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  width: 114px;
  max-height: 114px;
}
</style>
