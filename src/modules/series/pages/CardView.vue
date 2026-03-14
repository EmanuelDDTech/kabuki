<template>
  <div class="py-8 px-6">
    <div class="max-w-7xl mx-auto">
      <RouterLink
        :to="{ name: 'expansion', params: { setId: cardStore.cardData?.set?.id || 'me02.5' } }"
        class="inline-block ml-4 text-shori-gray-12 hover:bg-shori-gray-3 py-1 px-2 font-medium rounded-lg text-sm transition-colors"
      >
        <div class="flex gap-2 items-center justify-start">
          <LeftArrow class="w-6" />
          <p>Volver</p>
        </div>
      </RouterLink>
      <div
        v-if="cardStore.cardData"
        class="max-w-7xl w-full mx-auto bg-shori-gray-2 backdrop-blur-lg rounded-2xl shadow-2xl shadow-shori-gray-8 overflow-hidden"
      >
        <div class="flex flex-col lg:flex-row">
          <!-- Card Image Section -->
          <div class="lg:w-1/2 p-8 flex items-center justify-center">
            <div class="relative">
              <div
                class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-3xl transform rotate-3 opacity-20"
              ></div>
              <img
                :src="cardStore.cardData.image"
                :alt="cardStore.cardData.name"
                class="relative w-full max-w-md h-auto rounded-3xl shadow-2xl transform"
              />
            </div>
          </div>

          <!-- Card Details Section -->
          <div class="lg:w-1/2 p-8 text-shori-gray-12">
            <div class="space-y-6">
              <div>
                <h1 class="text-5xl font-bold mb-2">
                  {{ cardStore.cardData.name }}
                </h1>
                <p v-if="cardStore.cardData.category" class="text-xl text-shori-gray-11 italic">
                  {{ cardStore.cardData.category }}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-shori-gray-3 rounded-xl p-4 backdrop-blur-sm">
                  <h3 class="text-lg font-semibold text-shori-gray-11 mb-2">Rareza</h3>
                  <p class="text-2xl font-bold">{{ cardStore.cardData.rarity || 'N/A' }}</p>
                </div>

                <div class="bg-shori-gray-3 rounded-xl p-4 backdrop-blur-sm">
                  <h3 class="text-lg font-semibold text-shori-gray-11 mb-2">Expansión</h3>
                  <p class="text-2xl font-bold">{{ cardStore.cardData.set?.name || 'N/A' }}</p>
                </div>

                <div class="bg-shori-gray-3 rounded-xl p-4 backdrop-blur-sm">
                  <h3 class="text-lg font-semibold text-shori-gray-11 mb-2">Stage</h3>
                  <p class="text-2xl font-bold">{{ cardStore.cardData.stage || 'N/A' }}</p>
                </div>

                <div class="bg-shori-gray-3 rounded-xl p-4 backdrop-blur-sm">
                  <h3 class="text-lg font-semibold text-shori-gray-11 mb-2">N° de carta</h3>
                  <p class="text-2xl font-bold">{{ cardStore.cardData.localId }}</p>
                </div>
              </div>

              <div
                v-if="cardStore.cardData.types && cardStore.cardData.types.length > 0"
                class="bg-shori-gray-3 rounded-xl p-4 backdrop-blur-sm"
              >
                <h3 class="text-lg font-semibold text-shori'gray'11 mb-3">Types</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="type in cardStore.cardData.types"
                    :key="type"
                    class="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow"
                    >{{ type }}</span
                  >
                </div>
              </div>

              <div
                v-if="cardStore.cardData.illustrator"
                class="bg-shori-gray-3 rounded-xl p-4 backdrop-blur-sm"
              >
                <h3 class="text-lg font-semibold text-shori'gray'11 mb-2">Illustrator</h3>
                <p class="text-xl">{{ cardStore.cardData.illustrator }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        <div class="text-6xl mb-4">🔍</div>
        <p class="text-white text-2xl font-light">Card not found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCardStore } from '../stores/card';

import LeftArrow from '@/modules/icons/ArrowLeft.vue';

const route = useRoute();
const cardId = ref<string | null>(null);

const cardStore = useCardStore();

watch(
  route,
  () => {
    const param = route.params.cardId;
    cardId.value = Array.isArray(param) ? param[0] : param;

    cardStore.getCardById(cardId.value);
  },
  {
    immediate: true,
    deep: true,
  },
);

onUnmounted(() => {
  cardStore.clearCardInfo();
});
</script>
