<template>
  <nav
    id=".image-row"
    class="flex justify-between text-base max-w-screen-xl mx-auto text-center leading-none py-9 overflow-x-auto snap-mandatory"
  >
    <RouterLink
      v-for="route in routes"
      :to="{ name: route.name, query: route.query }"
      :key="route.name"
      class="group py-3 px-3 mx-2 min-w-[100px] w-[100px] relative hover:text-green-500 transition-all duration-300 after:transition-all after:duration-300 after:content-[''] after:w-0 after:absolute after:h-[2px] after:bottom-0 after:right-2/4 after:bg-green-500 after:translate-x-2/4 hover:after:w-full"
      draggable="false"
    >
      <div>
        <img
          :src="route.img"
          :alt="route.text"
          class="group-hover:animate-customBounce transition-transform ease-out flex-grow-0 flex-shrink-0 basis-auto"
          draggable="false"
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
</script>
