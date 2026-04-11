<script setup lang="ts">
import { computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import type { SortType } from '../composables/useCardFilters';
import FloatingOptions from '@/modules/layouts/components/FloatingOptions.vue';

interface Props {
  sortBy: SortType;
  rarities: string[];
  types: string[];
  availableRarities: string[];
  availableTypes: string[];
  hasActiveFilters: boolean;
}

interface Emits {
  (e: 'update:sortBy', value: SortType): void;
  (e: 'toggle-rarity', value: string): void;
  (e: 'toggle-type', value: string): void;
  (e: 'clear-filters'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const sortOptions = [
  { value: 'number' as const, label: 'Numero de carta (#)' },
  { value: 'price' as const, label: 'Precio' },
  { value: 'name' as const, label: 'Alfabetico (A-Z)' },
];

const rarityFloatingRef = ref<HTMLElement | null>(null);
const typeFloatingRef = ref<HTMLElement | null>(null);

const isRarityMenuOpen = ref(false);
const isTypeMenuOpen = ref(false);

const raritySummary = computed(() => {
  if (props.rarities.length === 0) return 'Seleccionar';
  if (props.rarities.length === 1) return props.rarities[0];
  return `${props.rarities.length} seleccionadas`;
});

const typeSummary = computed(() => {
  if (props.types.length === 0) return 'Seleccionar';
  if (props.types.length === 1) return props.types[0];
  return `${props.types.length} seleccionados`;
});

const activeFiltersCount = computed(() => props.rarities.length + props.types.length);

const onSortChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as SortType;
  emit('update:sortBy', value);
};

const toggleRarityMenu = () => {
  isTypeMenuOpen.value = false;
  isRarityMenuOpen.value = !isRarityMenuOpen.value;
};

const toggleTypeMenu = () => {
  isRarityMenuOpen.value = false;
  isTypeMenuOpen.value = !isTypeMenuOpen.value;
};

onClickOutside(rarityFloatingRef, () => {
  isRarityMenuOpen.value = false;
});

onClickOutside(typeFloatingRef, () => {
  isTypeMenuOpen.value = false;
});
</script>

<template>
  <div
    class="mb-6 rounded-2xl border border-shori-gray-5 bg-shori-gray-2/90 p-3 shadow-sm backdrop-blur-sm lg:mb-5 lg:p-2.5"
  >
    <div class="flex flex-wrap items-end gap-2.5 lg:flex-nowrap lg:items-center lg:gap-2">
      <div class="min-w-44 flex-1 lg:min-w-0 lg:w-[220px] lg:flex-none">
        <label
          class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-shori-gray-10"
          >Ordenar por</label
        >
        <select
          :value="sortBy"
          class="h-10 w-full rounded-lg border border-shori-gray-6 bg-shori-gray-1 px-3 text-sm font-medium text-shori-gray-12 outline-none transition-colors hover:border-shori-green-8 focus:border-shori-green-8 lg:h-9"
          @change="onSortChange"
        >
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div
        ref="rarityFloatingRef"
        class="relative min-w-44 flex-1 lg:min-w-0 lg:w-[190px] lg:flex-none"
      >
        <label
          class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-shori-gray-10"
          >Rareza</label
        >
        <button
          type="button"
          class="flex h-10 w-full items-center justify-between rounded-lg border border-shori-gray-6 bg-shori-gray-1 px-3 text-left text-sm font-medium text-shori-gray-12 transition-colors hover:border-shori-green-8 lg:h-9"
          @click="toggleRarityMenu"
        >
          <span class="truncate">{{ raritySummary }}</span>
          <span class="text-xs text-shori-gray-9">▼</span>
        </button>

        <FloatingOptions v-if="isRarityMenuOpen" class="w-full max-w-sm !left-0 !translate-x-0">
          <template #options>
            <button
              v-for="rarity in availableRarities"
              :key="rarity"
              type="button"
              class="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-shori-gray-3"
              @click="emit('toggle-rarity', rarity)"
            >
              <span>{{ rarity }}</span>
              <span v-if="rarities.includes(rarity)" class="text-shori-green-9">✓</span>
            </button>
          </template>
        </FloatingOptions>
      </div>

      <div
        ref="typeFloatingRef"
        class="relative min-w-44 flex-1 lg:min-w-0 lg:w-[190px] lg:flex-none"
      >
        <label
          class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-shori-gray-10"
          >Tipo de carta</label
        >
        <button
          type="button"
          class="flex h-10 w-full items-center justify-between rounded-lg border border-shori-gray-6 bg-shori-gray-1 px-3 text-left text-sm font-medium text-shori-gray-12 transition-colors hover:border-shori-green-8 lg:h-9"
          @click="toggleTypeMenu"
        >
          <span class="truncate capitalize">{{ typeSummary }}</span>
          <span class="text-xs text-shori-gray-9">▼</span>
        </button>

        <FloatingOptions v-if="isTypeMenuOpen" class="w-full max-w-sm !left-0 !translate-x-0">
          <template #options>
            <button
              v-for="type in availableTypes"
              :key="type"
              type="button"
              class="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm capitalize hover:bg-shori-gray-3"
              @click="emit('toggle-type', type)"
            >
              <span>{{ type }}</span>
              <span v-if="types.includes(type)" class="text-shori-green-9">✓</span>
            </button>
          </template>
        </FloatingOptions>
      </div>

      <div
        class="flex w-full items-center justify-between gap-2 pt-1 lg:ml-auto lg:w-auto lg:justify-end lg:pt-0"
      >
        <button
          v-if="hasActiveFilters"
          type="button"
          class="h-10 rounded-lg border border-shori-green-7 px-3.5 text-sm font-semibold text-shori-green-10 transition-colors hover:bg-shori-green-2 lg:h-9"
          @click="emit('clear-filters')"
        >
          Limpiar
        </button>

        <div
          class="inline-flex h-10 items-center rounded-full border border-shori-gray-6 bg-shori-gray-1 px-3 text-xs font-semibold text-shori-gray-10 lg:h-9"
        >
          {{ activeFiltersCount }} activos
        </div>
      </div>
    </div>
  </div>
</template>
