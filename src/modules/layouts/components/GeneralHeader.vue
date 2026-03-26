<template>
  <div class="flex items-center gap-3">
    <ThemeToggle />

    <RouterLink :to="{ name: 'home' }" class="hidden lg:flex" aria-label="Notificaciones">
      <NotificationIcon
        class="w-6 aspect-square text-shori-gray-11 hover:text-shori-green-9 transition-colors"
      />
    </RouterLink>

    <RouterLink :to="{ name: 'cart' }" class="relative" aria-label="Ir al carrito">
      <CartIcon
        class="w-6 aspect-square text-shori-gray-11 hover:text-shori-green-9 transition-colors"
      />
      <div
        v-if="!isCartEmpty"
        class="absolute w-4 h-4 bg-shori-green-9 rounded-full -top-1 -right-1 flex justify-center items-center"
      >
        <p class="text-shori-green-contrast text-xs">{{ cartLength }}</p>
      </div>
    </RouterLink>

    <button
      type="button"
      class="block lg:hidden"
      aria-label="Abrir menú"
      @click="emit('toggle-menu')"
    >
      <HamburguerBarsIcon class="w-7 aspect-square text-shori-gray-11" />
    </button>
  </div>
</template>

<script setup lang="ts">
import CartIcon from '@cart/components/CartIcon.vue';
import NotificationIcon from '@/modules/notification/components/NotificationIcon.vue';
import { RouterLink } from 'vue-router';
import HamburguerBarsIcon from './HamburguerBarsIcon.vue';
import ThemeToggle from '@/modules/common/components/ThemeToggle.vue';

defineProps<{
  isCartEmpty: boolean;
  cartLength: number;
}>();

const emit = defineEmits<{
  (event: 'toggle-menu'): void;
}>();
</script>
