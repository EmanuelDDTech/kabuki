<template>
  <main class="mt-6 mx-4 p-4 sm:p-6 xl:p-8 bg-white shadow rounded-lg ">
    <ProductForm :id="id" />
  </main>
</template>

<script setup>
import ProductForm from '@/components/product/ProductForm.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id;

</script>

<style scoped>

</style>