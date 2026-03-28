<template>
  <RouterLink
    :to="{ name: 'expansion', params: { setId: set.id } }"
    class="group block w-full max-w-xs overflow-hidden rounded-2xl border border-shori-gray-6 bg-shori-gray-3 shadow-sm shadow-shori-gray-track transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
  >
    <div class="relative aspect-[4/3] bg-shori-gray-2">
      <img
        :src="set.logo"
        :alt="`Logo de ${set.name}`"
        class="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>

    <div class="flex items-center gap-2 px-4 py-3 transition-all duration-200 group-hover:gap-4">
      <h3 class="truncate text-lg font-semibold text-shori-gray-12">{{ set.name }}</h3>
      <ArrowRight class="h-4 w-4 shrink-0" />
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { Set } from '../interfaces';
import ArrowRight from '@/modules/icons/ArrowRight.vue';

defineProps<{
  set: Set;
}>();
</script>
