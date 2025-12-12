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
  <div class="mb-4 flex gap-2">
    <button
      v-for="option in options"
      :key="option"
      @click="$emit('selectOption', option)"
      :class="[
        'px-4 py-2 rounded',
        selectedOption === option ? 'bg-blue-600 text-shori-gray-12' : 'bg-shori-gray-3',
      ]"
    >
      {{ option }}
    </button>
  </div>
</template>
