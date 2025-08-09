<script setup lang="ts">
import { RouterView } from 'vue-router';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import CardsLoader from './modules/common/components/CardsLoader.vue';
import { useUserStore } from './modules/auth/stores/user';
import { AuthStatus } from './modules/auth/interfaces';

const userStore = useUserStore();

userStore.$subscribe(
  async (_, state) => {
    if (state.authStatus === AuthStatus.Checking) {
      setTimeout(async () => {
        await userStore.checkAuthStatus();
      }, 2000);

      return;
    }
  },
  {
    immediate: true,
  },
);
</script>

<template data-theme="light">
  <CardsLoader v-if="userStore.isChecking" />
  <RouterView v-else />
  <VueQueryDevtools />
</template>
