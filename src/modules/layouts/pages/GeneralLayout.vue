<template>
  <div>
    <GeneralHeader class="px-3" />
    <NavBar :routes="routes" class="px-3" />
    <MainBanner />
    <RouterView class="px-3" />
    <GeneralFooter class="px-3" />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import GeneralHeader from '../components/GeneralHeader.vue';
import GeneralFooter from '../components/GeneralFooter.vue';
import NavBar from '../components/NavBar.vue';
import MainBanner from '../components/MainBanner.vue';

const routes = [
  { name: 'home', text: 'Inicio' },
  { name: 'products', text: 'Productos' }
]
</script>

<style scoped>

</style>