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
        <!-- Filter Bar -->
        <CardFilterBar
          :sortBy="filters.sortBy"
          :rarities="filters.rarities"
          :types="filters.types"
          :availableRarities="uniqueRarities"
          :availableTypes="uniqueTypes"
          :hasActiveFilters="hasActiveFilters"
          @update:sortBy="setSortBy"
          @toggle-rarity="toggleRarity"
          @toggle-type="toggleType"
          @clear-filters="clearFilters"
        />

        <!-- Cards Grid -->
        <ul
          v-if="filteredCards.length > 0 && !setStore.isLoading"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <li v-for="card in filteredCards" :key="card.id" class="flex justify-center">
            <RouterLink
              class="w-full max-w-xs cursor-pointer"
              :to="{ name: 'cards', params: { cardId: card.id } }"
            >
              <div class="min-h-[400px] rounded-t-2xl">
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
          </li>
        </ul>

        <!-- Empty State -->
        <div v-if="filteredCards.length === 0 && !setStore.isLoading" class="text-center py-12">
          <p class="text-shori-gray-9 text-lg">
            No se encontraron cartas con los filtros aplicados.
          </p>
        </div>

        <!-- Skeleton Loading -->
        <ul
          v-if="setStore.isLoading"
          class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <li v-for="item in skeletonItems" :key="item" class="flex justify-center">
            <ExpansionCardSkeleton />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useSetStore } from '../stores/set';
import { useCardFilters } from '../composables/useCardFilters';
import ExpansionCardSkeleton from '../components/ExpansionCardSkeleton.vue';
import CardFilterBar from '../components/CardFilterBar.vue';

import ArrowRight from '@/modules/icons/ArrowRight.vue';
import LeftArrow from '@/modules/icons/ArrowLeft.vue';

const route = useRoute();
const setId = ref<string | null>(null);
const skeletonItems = Array.from({ length: 8 }, (_, index) => index);

const setStore = useSetStore();

const cards = computed(() => setStore.setData?.cards || []);

const {
  filteredCards,
  uniqueRarities,
  uniqueTypes,
  filters,
  setSortBy,
  toggleRarity,
  toggleType,
  clearFilters,
  hasActiveFilters,
} = useCardFilters(cards);

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

onUnmounted(() => {
  setStore.clearSet();
});
</script>
