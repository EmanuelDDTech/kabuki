<template>
  <header
    id="header"
    class="max-w-7xl mx-auto rounded-full px-6 sticky -top-28 z-10 bg-white transition-all duration-500"
  >
    <div class="flex justify-between items-center mx-auto py-3">
      <RouterLink :to="{ name: 'home' }" class="w-40 text-2xl font-bold hidden lg:block">
        <!-- <img src="@assets/img/logo.avif" alt=""/> -->
        ShoriKameCards
      </RouterLink>
      <SearchBar />
      <nav class="gap-6 text-base text-gray-400 hidden lg:flex">
        <RouterLink :to="{ name: 'home' }"
          ><NotificationIcon class="w-7 aspect-square hover:text-blue-500 transition-colors" />
        </RouterLink>
        <RouterLink :to="{ name: 'home' }"
          ><CartIcon class="w-7 aspect-square hover:text-blue-500 transition-colors"
        /></RouterLink>
      </nav>
      <HamburguerBarsIcon class="w-7 ml-6 aspect-square text-gray-400 block lg:hidden" />
    </div>
  </header>
</template>

<script setup lang="ts">
import SearchBar from '@/modules/search/components/SearchBar.vue';
import CartIcon from '@cart/components/CartIcon.vue';
import NotificationIcon from '@/modules/notification/components/NotificationIcon.vue';
import { RouterLink } from 'vue-router';
import { onMounted } from 'vue';
import HamburguerBarsIcon from './HamburguerBarsIcon.vue';

const routes = [{ name: 'products', text: 'Productos' }];

onMounted(() => {
  const header: null | HTMLElement = document.querySelector('#header');
  let lastScrollTop = window.scrollY || document.documentElement.scrollTop;

  window.addEventListener('scroll', () => {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > 150) {
      if (scrollTop > lastScrollTop) {
        // Scroll hacia abajo
        header?.classList.add('-top-28');
        header?.classList.remove('top-2');
        header?.classList.remove('shadow-md');
      } else {
        // Scroll hacia arriba
        header?.classList.remove('-top-28');
        header?.classList.add('top-2');
        header?.classList.add('shadow-md');
      }
    } else {
      header?.classList.add('-top-28');
      header?.classList.remove('top-2');
      header?.classList.remove('shadow-md');
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Para Mobile o cuando el scroll es negativo
  });
});
</script>

<style scoped>
.sticky-hidden {
  @apply -top-full;
}
</style>
