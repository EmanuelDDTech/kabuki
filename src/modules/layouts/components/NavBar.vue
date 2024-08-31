<template>
  <nav class="flex justify-center text-lg border-b">
    <RouterLink  
      v-for="route in routes"
      :to="{ name: route.name}"
      :key="route.name"
      class="py-3 px-3 mx-2 relative hover:text-blue-500 transition-all duration-300 after:transition-all after:duration-300 after:content-[''] after:w-0 after:absolute after:h-[2px] after:bottom-0 after:right-2/4 after:bg-blue-500 after:translate-x-2/4 hover:after:w-full"
    >{{ route.text }}</RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';


interface route {
  name: string,
  text: string,
}

interface Props {
  routes: route[],
}

defineProps<Props>();
</script>

<style scoped>

</style>