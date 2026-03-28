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

        <div v-if="!serieStore.isLoading" class="w-full max-w-96 mx-auto mt-6">
          <img :src="serieStore.serieData?.logo" :alt="`Logo de ${serieStore.serieData?.name}`" />
        </div>
      </header>

      <div>
        <ul
          v-if="serieStore.serieData?.sets && serieStore.serieData.sets.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <li v-for="set in serieStore.serieData?.sets" :key="set.id" class="flex justify-center">
            <SetCard :set="set" />
          </li>
        </ul>

        <ul
          v-if="serieStore.isLoading"
          class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <li v-for="item in skeletonItems" :key="item" class="flex justify-center">
            <SetCardSkeleton />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSerieStore } from '../stores/serie';
import SetCard from '../components/SetCard.vue';
import SetCardSkeleton from '../components/SetCardSkeleton.vue';

import LeftArrow from '@/modules/icons/ArrowLeft.vue';

const route = useRoute();
const serieId = ref<string | null>(null);

const serieStore = useSerieStore();
const skeletonItems = Array.from({ length: 8 }, (_, index) => index);

onMounted(() => {
  const param = route.params.serieId;
  serieId.value = Array.isArray(param) ? param[0] : param;

  serieStore.getSerieById(serieId.value);
});

onUnmounted(() => {
  serieStore.clearSerie();
});
</script>
