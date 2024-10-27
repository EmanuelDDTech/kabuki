<script lang="ts" setup>
import { RouterLink } from 'vue-router';

defineProps({
  route: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  icon: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <RouterLink
    :to="{ name: route }"
    class="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group"
  >
    <component :is="icon" />
    <span class="ml-3 flex-1 whitespace-nowrap">{{ text }}</span>
  </RouterLink>
</template>
