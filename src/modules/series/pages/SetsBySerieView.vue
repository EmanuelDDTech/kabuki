<template>
  <div class="py-8 px-6">
    <div class="max-w-7xl mx-auto">
      <RouterLink
        :to="{ name: 'series' }"
        class="inline-block ml-4 text-shori-gray-12 hover:bg-shori-gray-3 py-1 px-2 font-medium rounded-lg text-sm transition-colors"
      >
        <div class="flex gap-2 items-center justify-start">
          <LeftArrow class="w-6" />
          <p>Volver</p>
        </div>
      </RouterLink>
      <header class="mb-10 text-center">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-shori-gray-12">
          Sets de {{ serieStore.serieData?.name }}
        </h1>
        <p class="mt-3 text-sm sm:text-base text-shori-gray-9 max-w-2xl mx-auto">
          Explora las expansiones disponibles en {{ serieStore.serieData?.name }}.
        </p>

        <div class="w-96 mx-auto mt-6">
          <img :src="serieStore.serieData?.logo" :alt="`Logo de ${serieStore.serieData?.name}`" />
        </div>
      </header>

      <div>
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <li v-for="set in serieStore.serieData?.sets" :key="set.id" class="flex justify-center">
            <RouterLink
              class="w-full max-w-xs bg-shori-gray-3 border border-shori-gray-6 rounded-2xl shadow-sm shadow-shori-gray-track transition-shadow duration-200 overflow-hidden cursor-pointer"
              :to="{ name: 'expansion', params: { setId: set.id } }"
            >
              <div class="relative aspect-[4/3] bg-shori-gray-2">
                <img
                  :src="set.logo"
                  :alt="`Logo de ${set.name}`"
                  class="absolute inset-0 w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div
                class="px-4 py-3 flex items-center gap-2 hover:gap-4 transition-all duration-200"
              >
                <h3 class="text-lg font-semibold text-shori-gray-12 truncate">{{ set.name }}</h3>
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
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSerieStore } from '../stores/serie';

import ArrowRight from '@/modules/icons/ArrowRight.vue';
import LeftArrow from '@/modules/icons/ArrowLeft.vue';

const route = useRoute();
const serieId = ref<string | null>(null);

const serieStore = useSerieStore();

onMounted(() => {
  const param = route.params.serieId;
  serieId.value = Array.isArray(param) ? param[0] : param;

  serieStore.getSerieById(serieId.value);
});
</script>
