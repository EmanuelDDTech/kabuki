<template>
  <div>
    <GeneralHeader />
    <RouterView />
    <GeneralFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import GeneralHeader from '../components/GeneralHeader.vue';
import GeneralFooter from '../components/GeneralFooter.vue';
</script>

<style scoped>

</style>