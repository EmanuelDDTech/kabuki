<template>
  <div class="py-8 px-6">
    <div class="max-w-7xl mx-auto">
      <header class="mb-10 text-center">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-shori-gray-12">Series</h1>
        <p class="mt-3 text-sm sm:text-base text-shori-gray-9 max-w-2xl mx-auto">
          Explora las colecciones disponibles y ve de un vistazo los logos principales de cada
          serie. Desliza hacia abajo para cargar más.
        </p>
      </header>

      <InfiniteScrollList
        :items="paginationStore.items"
        :loading="paginationStore.loading"
        :hasMore="paginationStore.hasMore"
        @load-more="paginationStore.loadMore"
      >
        <template #items="{ items }">
          <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <li v-for="item in items" :key="item.id" class="flex justify-center">
              <RouterLink
                class="w-full max-w-xs bg-shori-gray-3 border border-shori-gray-6 rounded-2xl shadow-sm shadow-shori-gray-track transition-shadow duration-200 overflow-hidden cursor-pointer"
                :to="{ name: 'setsBySeries', params: { serieId: item.id } }"
              >
                <div class="relative aspect-[4/3] bg-shori-gray-2">
                  <img
                    :src="item.logo"
                    :alt="`Logo de ${item.name}`"
                    class="absolute inset-0 w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div
                  class="px-4 py-3 flex items-center gap-2 hover:gap-4 transition-all duration-200"
                >
                  <h3 class="text-lg font-semibold text-shori-gray-12 truncate">{{ item.name }}</h3>
                  <ArrowRight class="w-4 h-4" />
                </div>
              </RouterLink>
            </li>
          </ul>
        </template>

        <template #loader>
          <div class="text-center py-10 text-shori-gray-10">Cargando más series…</div>
        </template>

        <template #end>
          <div class="text-center py-10 text-shori-gray-10">
            ¡Llegaste al final! No hay más series por cargar.
          </div>
        </template>
      </InfiniteScrollList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

import { useSeriesStore } from '../stores/series';
import { usePaginationStore } from '@/modules/pagination/store/pagination';
import InfiniteScrollList from '@/modules/pagination/components/InfiniteScrollList.vue';
import ArrowRight from '@/modules/icons/ArrowRight.vue';

const seriesStore = useSeriesStore();
const paginationStore = usePaginationStore();

onMounted(() => {
  paginationStore.setFetcher(seriesStore.getSeries);
  paginationStore.loadItems(true);
});

onUnmounted(() => {
  paginationStore.resetValues();
});
</script>
