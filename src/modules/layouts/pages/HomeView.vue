<script setup lang="ts">
import SwiperSlider from '@/modules/slider/components/SwiperSlider.vue';
import MainBanner from '../components/MainBanner.vue';
import NavBar from '../components/NavBar.vue';
import LightingIcon from '@/modules/icons/LightingIcon.vue';
import DiscountIcon from '@/modules/icons/DiscountIcon.vue';
import ClosedBoxIcon from '../components/ClosedBoxIcon.vue';

const routes = [
  { name: '', text: 'Surgin Sparks', img: 'surgin_sparks.jpg' },
  { name: '', text: 'Stellar Crown', img: 'stellar_crown.jpg' },
  { name: '', text: 'Shrouded Fable', img: 'shrouded_fable.jpg' },
  { name: '', text: 'Twilight Masquerade', img: 'twilight_masquerade.jpg' },
  { name: '', text: 'Temporal Forces', img: 'temporal_forces.jpg' },
  { name: '', text: 'Paldean Fates', img: 'paldean_fate.jpg' },
  { name: '', text: 'Paradox Rift', img: 'paradox_rift.jpg' },
  { name: '', text: 'Obsidian Flames', img: 'obsidian_flames.jpg' },
  { name: '', text: 'Paldea Evolved', img: 'paldea_evolve.jpg' },
  { name: '', text: 'Scarlet & Violet', img: 'scarlet_violet.jpg' },
];
</script>

<template>
  <main>
    <MainBanner />
    <NavBar :routes="routes" />
    <section class="bg-gray-50 px-3">
      <div class="max-w-screen-xl mx-auto py-14">
        <SwiperSlider
          :title="'Preventa'"
          :countdown="true"
          :finish-date="new Date('Fri Sep 30 2024 22:00:00 GMT-0600 (hora estándar central)')"
          :icon="LightingIcon"
        />
      </div>
    </section>
    <section class="px-3">
      <div class="max-w-screen-xl mx-auto py-14">
        <SwiperSlider :title="'Ofertas'" :icon="DiscountIcon" />
      </div>
    </section>
    <section class="px-3">
      <div class="max-w-screen-xl mx-auto py-8">
        <header class="flex gap-3 mb-6">
          <ClosedBoxIcon class="w-9 aspect-square text-white bg-black p-2 rounded-full" />
          <h2 class="text-4xl font-bold">Producto cerrado</h2>
        </header>
        <div class="flex gap-6">
          <aside
            class="min-h-full min-w-96 border border-gray-100 bg-gray-50 rounded-lg shadow-lg"
          ></aside>
          <ul class="flex-1 grid grid-cols-2 gap-6">
            <li class="shadow-lg p-6 rounded-lg border border-gray-100">
              <h3 class="text-xl font-bold">Booster Box</h3>
              <p class="text-gray-400 mb-3">"Más cartas, más poder."</p>
              <div class="flex gap-3">
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
              </div>
            </li>
            <li class="shadow-lg p-6 rounded-lg border border-gray-100">
              <h3 class="text-xl font-bold">Elite Trainer Box</h3>
              <p class="text-gray-400 mb-3">"Todo lo que necesitas."</p>
              <div class="flex gap-3">
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
              </div>
            </li>
            <li class="shadow-lg p-6 rounded-lg border border-gray-100">
              <h3 class="text-xl font-bold">Premium Collection</h3>
              <p class="text-gray-400 mb-3">"Exclusividad garantizada."</p>
              <div class="flex gap-3">
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
              </div>
            </li>
            <li class="shadow-lg p-6 rounded-lg border border-gray-100">
              <h3 class="text-xl font-bold">Special Collection</h3>
              <p class="text-gray-400 mb-3">"Ediciones únicas."</p>
              <div class="flex gap-3">
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>
