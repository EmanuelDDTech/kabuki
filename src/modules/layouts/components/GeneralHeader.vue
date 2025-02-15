<template>
  <header
    id="header"
    class="max-w-7xl min-h-16 mx-auto border-gray-200 sticky top-2 z-10 rounded-full"
  >
    <div class="mx-auto z-10 bg-white rounded-full relative">
      <div class="flex justify-between items-center px-6 py-3">
        <RouterLink
          :to="{ name: 'home' }"
          class="text-xl font-bold items-center lg:ml-2.5 hidden lg:flex"
        >
          <img
            src="@/assets/img/shorikame-logo-edited.webp"
            class="h-12 mr-2"
            alt="Windster Logo"
          />
          <span class="self-center whitespace-nowrap">ShoriKameCards</span>
        </RouterLink>
        <SearchBar />
        <nav class="gap-6 text-base text-gray-400 hidden lg:flex">
          <RouterLink :to="{ name: 'home' }"
            ><NotificationIcon class="w-7 aspect-square hover:text-blue-500 transition-colors" />
          </RouterLink>

          <RouterLink :to="{ name: 'cart' }"
            ><CartIcon class="w-7 aspect-square hover:text-blue-500 transition-colors"
          /></RouterLink>
        </nav>
        <HamburguerBarsIcon
          @click="showMenu"
          class="w-7 ml-6 aspect-square text-gray-400 block lg:hidden"
        />
        <MobileMenu
          class="absolute top-0 right-0 transition-all block lg:hidden z-10"
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
      header?.classList.add('-top-24');

      header?.classList.add('transition-all');
      header?.classList.add('duration-500');
      header?.classList.add('shadow-md');

      if (scrollTop > lastScrollTop) {
        // Scroll hacia abajo
        header?.classList.add('-top-24');
        header?.classList.remove('top-2');
        showMobileMenu.value = false;
      } else {
        // Scroll hacia arriba
        header?.classList.remove('-top-24');
        header?.classList.add('top-2');
      }
    } else {
      header?.classList.remove('-top-24');
      header?.classList.remove('top-2');
      header?.classList.remove('shadow-md');

      header?.classList.remove('transition-all');
      header?.classList.remove('duration-500');

      showMobileMenu.value = false;
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
