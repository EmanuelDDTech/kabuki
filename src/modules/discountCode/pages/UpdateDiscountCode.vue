<script lang="ts" setup>
import { useRoute } from 'vue-router';
import DiscountCodeForm from '../components/DiscountCodeForm.vue';

const route = useRoute();
const id: number = parseInt(route.params.id[0]);
</script>

<template>
  <main class="mt-6 mx-4 p-4 sm:p-6 xl:p-8 bg-white shadow rounded-lg">
    <DiscountCodeForm :id="id" />
  </main>
</template>
