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
    class="text-body-normal text-shori-gray-12 font-normal rounded-xl hover:bg-shori-gray-3 flex items-center p-2 group border-r-2 transition-colors duration-300"
    :class="route === router.name ? 'bg-shori-gray-3 border-shori-gray-6' : 'border-transparent'"
  >
    <component :is="icon" class="w-6 h-6 text-shori-gray-12" />
    <span class="ml-3 flex-1 whitespace-nowrap">{{ text }}</span>
  </RouterLink>
</template>
