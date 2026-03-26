<template>
  <header
    id="site-header"
    class="sticky z-999 px-3 transition-all duration-500"
    :class="isHeaderHidden ? '-top-24 shadow-lg' : 'top-2 shadow-sm'"
  >
    <div
      class="max-w-7xl mx-auto rounded-2xl border border-shori-gray-6 backdrop-blur-sm"
      style="background-color: color-mix(in srgb, var(--gray-1) 84%, transparent)"
      @mouseleave="hideOptions"
    >
      <div class="flex items-center gap-3 px-4 py-3 lg:px-6">
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-3 shrink-0">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fkame_01.png?alt=media&token=9c1e6563-2477-4960-8ac0-efffbd5e0634"
            class="h-12 w-12 rounded-xl object-cover"
            alt="ShoriKameCards"
          />
          <div class="hidden sm:flex flex-col leading-tight">
            <span class="text-lg font-extrabold text-shori-gray-12">ShoriKameCards</span>
            <span class="text-xs text-shori-gray-10">Pokemon TCG Store</span>
          </div>
        </RouterLink>

        <div class="hidden lg:flex flex-1 max-w-xl relative">
          <SearchBar class="w-full max-w-none" />
        </div>

        <nav class="text-sm hidden lg:flex items-center gap-4 ml-1">
          <div class="flex gap-3 text-shori-gray-11 relative">
            <button
              class="flex items-center font-bold text-shori-gray-12 hover:text-shori-green-9 transition-colors"
              @mouseenter="showProductOptions"
            >
              Productos
            </button>
            <FloatingOptions v-if="isProductOptionsVisible">
              <template #options>
                <router-link
                  :to="{ name: 'products', query: { 'tipo-de-producto': 'producto-cerrado' } }"
                  class="whitespace-nowrap px-4 py-2 hover:bg-shori-gray-3 transition-colors rounded"
                  @click="updateProducts"
                  >Producto cerrado</router-link
                >
                <router-link
                  :to="{ name: 'products', query: { 'tipo-de-producto': 'cartas-sueltas' } }"
                  class="whitespace-nowrap px-4 py-2 hover:bg-shori-gray-3 transition-colors rounded"
                  @click="updateProducts"
                  >Carta suelta</router-link
                >
                <router-link
                  :to="{ name: 'products', query: { 'tipo-de-producto': 'decks-competitivos' } }"
                  class="whitespace-nowrap px-4 py-2 hover:bg-shori-gray-3 transition-colors rounded"
                  @click="updateProducts"
                  >Decks competitivos</router-link
                >
              </template>
            </FloatingOptions>
          </div>

          <div class="relative border-l border-shori-gray-7 pl-4">
            <button
              class="font-semibold text-shori-gray-12 hover:text-shori-green-9 transition-colors"
              @mouseenter="showProfileOptions"
            >
              {{ user.isSet ? `Hola, ${user.getUserName}` : 'Cuenta' }}
            </button>

            <FloatingOptions v-if="isProfileOptionsVisible" class="min-w-52">
              <template #options>
                <RouterLink
                  v-if="user.isAdmin"
                  :to="{ name: 'admin' }"
                  class="whitespace-nowrap px-4 py-2 hover:bg-shori-gray-3 transition-colors rounded"
                  >Ir al admin</RouterLink
                >

                <RouterLink
                  v-if="!user.isSet"
                  :to="{ name: 'register' }"
                  class="whitespace-nowrap px-4 py-2 hover:bg-shori-gray-3 transition-colors rounded"
                  >Registrarse</RouterLink
                >
                <RouterLink
                  v-if="!user.isSet"
                  :to="{ name: 'login' }"
                  class="whitespace-nowrap px-4 py-2 hover:bg-shori-gray-3 transition-colors rounded"
                  >Ingresar</RouterLink
                >

                <RouterLink
                  v-if="user.isSet"
                  :to="{ name: 'myPurchases' }"
                  class="whitespace-nowrap px-4 py-2 hover:bg-shori-gray-3 transition-colors rounded"
                  >Mis compras</RouterLink
                >
                <button
                  v-if="user.isSet"
                  type="button"
                  class="w-full text-left whitespace-nowrap px-4 py-2 hover:bg-shori-gray-3 transition-colors rounded text-red-600"
                  @click="user.logout"
                >
                  Cerrar sesión
                </button>

                <div class="px-3 pt-2 mt-1 border-t border-shori-gray-6">
                  <SocialsLinks class="justify-start pb-1" />
                </div>
              </template>
            </FloatingOptions>
          </div>
        </nav>

        <GeneralHeader
          class="ml-auto"
          :is-cart-empty="cartStore.isEmpty"
          :cart-length="cartStore.cartLength"
          @toggle-menu="showMenu"
        />
      </div>
    </div>

    <MobileMenu
      class="fixed top-0 right-0 transition-all block lg:hidden z-1000"
      :class="showMobileMenu ? 'translate-x-0' : 'translate-x-full'"
      @hide-menu="hideMenu"
    />
  </header>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/modules/auth/stores/user';
import FloatingOptions from './FloatingOptions.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useFilterCategoryStore } from '@/modules/filter/store/filterCategory';
import { useCartStore } from '@/modules/cart/stores/cart';
import SocialsLinks from './SocialsLinks.vue';
import SearchBar from '@/modules/search/components/SearchBar.vue';
import GeneralHeader from './GeneralHeader.vue';
import MobileMenu from './MobileMenu.vue';

const user = useUserStore();
const cartStore = useCartStore();
const filters = useFilterCategoryStore();
const isProductOptionsVisible = ref(false);
const isProfileOptionsVisible = ref(false);
const showMobileMenu = ref(false);
const isHeaderHidden = ref(false);
let lastScrollTop = 0;

const route = useRoute();

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  if (scrollTop > 180 && scrollTop > lastScrollTop) {
    isHeaderHidden.value = true;
    showMobileMenu.value = false;
  } else {
    isHeaderHidden.value = false;
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
};

onMounted(async () => {
  document.body.style.overflowX = 'hidden';
  await user.setUser();
  await cartStore.getCart();
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const showProductOptions = () => {
  isProfileOptionsVisible.value = false;
  isProductOptionsVisible.value = true;
};

const hideProductOptions = () => {
  isProductOptionsVisible.value = false;
};

const updateProducts = () => {
  if (route.name === 'products') {
    setTimeout(async () => {
      await filters.getFilters();
      await filters.getProducts();
    }, 100);
  }
};

const showProfileOptions = () => {
  isProductOptionsVisible.value = false;
  isProfileOptionsVisible.value = true;
};

const hideProfileOptions = () => {
  isProfileOptionsVisible.value = false;
};

const hideOptions = () => {
  hideProductOptions();
  hideProfileOptions();
};

const showMenu = () => {
  showMobileMenu.value = true;
};

const hideMenu = () => {
  showMobileMenu.value = false;
};
</script>
