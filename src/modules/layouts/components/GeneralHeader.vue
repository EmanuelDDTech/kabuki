<template>
  <header class="border-b">
    <div class="flex justify-between items-center max-w-7xl mx-auto py-3">
      <RouterLink :to="{ name: 'home' }" class="w-40"
        ><img src="@assets/img/logo.avif" alt=""
      /></RouterLink>
      <SearchBar />
      <nav class="flex gap-4 text-base">
        <RouterLink :to="{ name: 'home' }" class="flex items-center">Registrarse</RouterLink>
        <RouterLink :to="{ name: 'home' }"><CartIcon /></RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import SearchBar from '@/modules/search/components/SearchBar.vue';
import CartIcon from '@cart/components/CartIcon.vue';
import { RouterLink } from 'vue-router';
</script>

<style scoped></style>
