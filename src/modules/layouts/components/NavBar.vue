<template>
  <div class="relative max-w-screen-xl mx-auto px-3">
    <!-- Fade edges -->
    <div
      class="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-shori-bg to-transparent"
    />
    <div
      class="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-shori-bg to-transparent"
    />

    <nav
      ref="scrollContainer"
      class="flex gap-2 py-8 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory"
    >
      <RouterLink
        v-for="route in routes"
        :to="{ name: route.name, query: route.query }"
        :key="route.text"
        class="navbar-item group snap-start"
        draggable="false"
      >
        <div class="navbar-item__img-wrapper">
          <img
            :src="route.img"
            :alt="route.text"
            class="h-16 w-auto object-contain group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 drop-shadow-sm"
            draggable="false"
          />
        </div>
        <span class="navbar-item__label">{{ route.text }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface route {
  name: string;
  text: string;
  img: string;
  query?: Record<string, string>;
}

interface Props {
  routes: route[];
}

defineProps<Props>();
</script>

<style scoped>
.navbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 110px;
  padding: 0.75rem 0.5rem;
  border-radius: 1rem;
  border: 1px solid transparent;
  transition: all 0.25s ease;
  text-decoration: none;
  flex-shrink: 0;
}

.navbar-item:hover {
  background: var(--green-2);
  border-color: var(--green-5);
}

.navbar-item.router-link-active {
  background: var(--green-3);
  border-color: var(--green-7);
}

.navbar-item__img-wrapper {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background: var(--gray-1);
  border: 1px solid var(--gray-5);
  transition: all 0.25s ease;
  overflow: hidden;
}

.navbar-item:hover .navbar-item__img-wrapper {
  background: white;
  border-color: var(--green-6);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.08);
}

.navbar-item.router-link-active .navbar-item__img-wrapper {
  background: white;
  border-color: var(--green-7);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.1);
}

.navbar-item__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--gray-11);
  text-align: center;
  line-height: 1.2;
  transition: color 0.25s ease;
}

.navbar-item:hover .navbar-item__label {
  color: var(--green-9);
}

.navbar-item.router-link-active .navbar-item__label {
  color: var(--green-11);
}

nav::-webkit-scrollbar {
  display: none;
}
</style>
