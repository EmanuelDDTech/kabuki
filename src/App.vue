<script setup lang="ts">
import { RouterView } from 'vue-router';
import CardsLoader from './modules/common/components/CardsLoader.vue';
import { useUserStore } from './modules/auth/stores/user';

const userStore = useUserStore();
</script>

<template data-theme="light">
  <CardsLoader v-if="userStore.isChecking" />
  <RouterView v-else />
</template>
