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
              <SeriesCard :serie="item" />
            </li>
          </ul>
          <ul
            v-if="seriesStore.isLoading"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <li v-for="item in skeletonItems" :key="item" class="flex justify-center">
              <SeriesCardSkeleton />
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
import SeriesCard from '../components/SeriesCard.vue';
import SeriesCardSkeleton from '../components/SeriesCardSkeleton.vue';
import { usePaginationStore } from '@/modules/pagination/store/pagination';
import InfiniteScrollList from '@/modules/pagination/components/InfiniteScrollList.vue';

const seriesStore = useSeriesStore();
const paginationStore = usePaginationStore();
const skeletonItems = Array.from({ length: 8 }, (_, index) => index);

onMounted(() => {
  paginationStore.setFetcher(seriesStore.getSeries);
  paginationStore.loadItems(true);
});

onUnmounted(() => {
  paginationStore.resetValues();
});
</script>
