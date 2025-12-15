<script setup lang="ts">
import { useRoute } from 'vue-router';
import BannerForm from '../components/BannerForm.vue';

const route = useRoute();
const id: number = parseInt(route.params.id);
</script>

<template>
  <main class="mt-6 mx-4 p-4 sm:p-6 xl:p-8 bg-shori-gray-1 shadow rounded-lg">
    <BannerForm :id="id" />
  </main>
</template>
