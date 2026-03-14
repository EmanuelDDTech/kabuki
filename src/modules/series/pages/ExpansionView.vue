<template>
  <div class="py-8 px-6">
    <div class="max-w-7xl mx-auto">
      <RouterLink
        :to="{ name: 'setsBySeries', params: { serieId: setStore.setData?.serie?.id || 'me' } }"
        class="inline-block ml-4 text-shori-gray-12 hover:bg-shori-gray-3 py-1 px-2 font-medium rounded-lg text-sm transition-colors"
      >
        <div class="flex gap-2 items-center justify-start">
          <LeftArrow class="w-6" />
          <p>Volver</p>
        </div>
      </RouterLink>
      <header class="mb-10 text-center">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-shori-gray-12">
          {{ setStore.setData?.name }}
        </h1>
        <p class="mt-3 text-sm sm:text-base text-shori-gray-9 max-w-2xl mx-auto">
          Explora las cartas disponibles en {{ setStore.setData?.name }}.
        </p>

        <div class="w-full max-w-96 mx-auto mt-6">
          <img :src="setStore.setData?.logo" :alt="`Logo de ${setStore.setData?.name}`" />
        </div>
      </header>

      <div>
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <li v-for="card in setStore.setData?.cards" :key="card.id" class="flex justify-center">
            <RouterLink
              class="w-full max-w-xs cursor-pointer"
              :to="{ name: 'cards', params: { cardId: card.id } }"
            >
              <div class="">
                <img
                  :src="card.image"
                  :alt="`Logo de ${card.name}`"
                  loading="lazy"
                  class="inset-0 w-full h-full object-contain"
                />
              </div>

              <div
                class="px-4 py-3 flex items-center gap-2 hover:gap-4 transition-all duration-200"
              >
                <h3 class="text-lg font-semibold text-shori-gray-12 truncate">
                  <span class="text-shori-gray-11">#{{ card.localId }}</span> {{ card.name }}
                </h3>
                <ArrowRight class="w-4 h-4" />
              </div>
            </RouterLink>
            <!-- <img :src="`${set.logo}.webp`" :alt="`Imagen de ${set.name}`" /> -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useSetStore } from '../stores/set';

import ArrowRight from '@/modules/icons/ArrowRight.vue';
import LeftArrow from '@/modules/icons/ArrowLeft.vue';

const route = useRoute();
const setId = ref<string | null>(null);

const setStore = useSetStore();

watch(
  route,
  () => {
    const param = route.params.setId;
    setId.value = Array.isArray(param) ? param[0] : param;

    setStore.getSetById(setId.value);
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>
