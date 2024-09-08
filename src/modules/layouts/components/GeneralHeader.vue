<template>
  <header class="min-h-16">
    <div id="header" class="max-w-7xl mx-auto rounded-full px-6 left-0 right-0 z-10 bg-white">
      <div class="flex justify-between items-center mx-auto py-3 relative">
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
        <HamburguerBarsIcon
          @click="showMenu"
          class="w-7 ml-6 aspect-square text-gray-400 block lg:hidden"
        />
        <MobileMenu
          class="absolute top-0 -right-6 transition-all block lg:hidden"
          :class="showMobileMenu ? 'translate-x-0' : 'translate-x-64'"
          @hide-menu="hideMenu"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import SearchBar from '@/modules/search/components/SearchBar.vue';
import CartIcon from '@cart/components/CartIcon.vue';
import NotificationIcon from '@/modules/notification/components/NotificationIcon.vue';
import { RouterLink } from 'vue-router';
import { onMounted, ref } from 'vue';
import HamburguerBarsIcon from './HamburguerBarsIcon.vue';
import MobileMenu from './MobileMenu.vue';

const showMobileMenu = ref(false);

const routes = [{ name: 'products', text: 'Productos' }];

onMounted(() => {
  const header: null | HTMLElement = document.querySelector('#header');
  let lastScrollTop = window.scrollY || document.documentElement.scrollTop;

  window.addEventListener('scroll', () => {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > 200) {
      header?.classList.add('fixed');
      header?.classList.add('-top-24');

      header?.classList.add('transition-all');
      header?.classList.add('duration-500');

      if (scrollTop > lastScrollTop) {
        // Scroll hacia abajo
        header?.classList.add('-top-24');
        header?.classList.remove('top-2');
        header?.classList.remove('shadow-md');
        showMobileMenu.value = false;
      } else {
        // Scroll hacia arriba
        header?.classList.remove('-top-24');
        header?.classList.add('top-2');
        header?.classList.add('shadow-md');
      }
    } else {
      header?.classList.remove('fixed');
      header?.classList.remove('-top-24');
      header?.classList.remove('top-2');
      header?.classList.remove('shadow-md');

      header?.classList.remove('transition-all');
      header?.classList.remove('duration-500');
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Para Mobile o cuando el scroll es negativo
  });
});

const showMenu = () => {
  showMobileMenu.value = true;
};

const hideMenu = () => {
  showMobileMenu.value = false;
};
</script>
