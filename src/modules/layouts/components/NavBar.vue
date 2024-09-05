<template>
  <nav
    class="flex justify-center text-base border-b max-w-screen-xl mx-auto text-center leading-none py-9"
  >
    <RouterLink
      v-for="route in routes"
      :to="{ name: route.name }"
      :key="route.name"
      class="group py-3 px-3 mx-2 relative hover:text-blue-500 transition-all duration-300 after:transition-all after:duration-300 after:content-[''] after:w-0 after:absolute after:h-[2px] after:bottom-0 after:right-2/4 after:bg-blue-500 after:translate-x-2/4 hover:after:w-full"
    >
      <div>
        <img
          :src="getImageUrl(route.img)"
          :alt="route.text"
          class="group-hover:animate-customBounce transition-transform ease-out"
        />
      </div>
      {{ route.text }}
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface route {
  name: string;
  text: string;
  img: string;
}

interface Props {
  routes: route[];
}

defineProps<Props>();

const getImageUrl = (imageName: string) => {
  return new URL(`/src/assets/img/${imageName}`, import.meta.url).href;
};
</script>
