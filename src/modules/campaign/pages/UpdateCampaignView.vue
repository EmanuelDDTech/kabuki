<template>
  <main class="mt-6 mx-4 p-4 sm:p-6 xl:p-8 bg-white shadow rounded-lg">
    <CampaignForm :id="id" />
  </main>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import CampaignForm from '../components/CampaignForm.vue';

const route = useRoute();
const id: number = parseInt(route.params.id);
</script>
