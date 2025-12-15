<script lang="ts" setup>
import { useRoute } from 'vue-router';
import CategoryForm from '../components/CategoryForm.vue';

const route = useRoute();
const id: number = parseInt(route.params.id);
</script>

<template>
  <main class="mt-6 mx-4 p-4 sm:p-6 xl:p-8 bg-shori-gray-1 shadow rounded-lg">
    <CategoryForm :id="id" />
  </main>
</template>
