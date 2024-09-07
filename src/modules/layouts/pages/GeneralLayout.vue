<template>
  <div>
    <TopNavBar />
    <GeneralHeader />
    <RouterView />
    <GeneralFooter class="px-3" />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import TopNavBar from '../components/TopNavBar.vue';
import GeneralHeader from '../components/GeneralHeader.vue';
import GeneralFooter from '../components/GeneralFooter.vue';
</script>

<style scoped></style>
