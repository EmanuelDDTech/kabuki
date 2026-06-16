<script setup lang="ts">
import type { Period } from '@/modules/cart/interfaces/sale.interface';

interface Props {
  options: Period[];
  selectedOption: Period;
}

defineProps<Props>();

defineEmits(['selectOption']);
</script>
<template>
  <div class="mb-0 flex flex-wrap gap-2">
    <button
      v-for="option in options"
      :key="option"
      @click="$emit('selectOption', option)"
      :class="[
        'rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-200',
        selectedOption === option
          ? 'border-shori-green-7 bg-shori-green-3 text-shori-green-11'
          : 'border-shori-gray-6 bg-shori-gray-3 text-shori-gray-11 hover:border-shori-gray-5 hover:text-shori-gray-12',
      ]"
    >
      {{ option }}
    </button>
  </div>
</template>
