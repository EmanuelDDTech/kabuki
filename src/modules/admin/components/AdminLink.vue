<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router';

const router = useRoute();

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
    class="text-base text-shori-gray-12 font-normal rounded-lg hover:bg-shori-gray-3 flex items-center p-2 group"
    :class="route === router.name ? 'bg-shori-gray-3' : ''"
  >
    <component :is="icon" class="w-8 h-8 text-shori-gray-12" />
    <span class="ml-3 flex-1 whitespace-nowrap">{{ text }}</span>
  </RouterLink>
</template>
