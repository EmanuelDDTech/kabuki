<script setup lang="ts">
import SwiperSlider from '@/modules/slider/components/SwiperSlider.vue';
import MainBanner from '../components/MainBanner.vue';
import NavBar from '../components/NavBar.vue';
import LightingIcon from '@/modules/icons/LightingIcon.vue';
import DiscountIcon from '@/modules/icons/DiscountIcon.vue';

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
        <h2>Producto Cerrado</h2>
      </div>
    </section>
  </main>
</template>
