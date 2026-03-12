<template>
  <div class="border-b-2 border-shori-gray-6 px-3" @mouseleave="hideOptions">
    <div class="flex justify-center lg:justify-between items-center max-w-7xl mx-auto py-2">
      <RouterLink :to="{ name: 'home' }" class="text-2xl font-bold flex gap-2">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fkame_01.png?alt=media&token=9c1e6563-2477-4960-8ac0-efffbd5e0634"
          class="h-20 mr-2"
          alt="Windster Logo"
        />
        <span class="self-center whitespace-nowrap text-shori-gray-12">ShoriKameCards</span>
      </RouterLink>
      <!-- <SearchBar /> -->

      <SocialsLinks class="hidden lg:flex" />

      <nav class="text-base hidden lg:flex">
        <RouterLink v-if="user.isAdmin" :to="{ name: 'admin' }">
          <GeneralButton class="mr-3 ml-5" :text="'Ir al admin'" :icon="DashboardIcon" />
        </RouterLink>
        <div class="flex gap-3 border-r-2 border-shori-gray-7 text-shori-gray-11 relative">
          <!-- <RouterLink
            :to="{ name: 'home' }"
            class="flex items-center pr-4 hover:text-blue-500 transition-colors"
            >Sobre Nosotros</RouterLink
          > -->
          <button
            class="flex items-center pr-4 font-bold text-shori-gray-12 transition-colors"
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
        <div class="flex pl-4 font-semibold text-shori-gray-12" v-if="!user.isSet">
          <RouterLink
            :to="{ name: 'register' }"
            class="flex items-center pr-4 border-r-2 border-shori-gray-6 hover:text-blue-500 transition-colors"
            >Registrarse</RouterLink
          >
          <RouterLink
            :to="{ name: 'login' }"
            class="flex items-center pl-4 hover:text-blue-500 transition-colors"
            >Ingresar</RouterLink
          >
        </div>
        <div class="flex pl-4 text-shori-gray-11" v-if="user.isSet">
          <div
            class="flex items-center pr-4 border-r-2 border-shori-gray-6 transition-colors cursor-pointer relative"
            @mouseenter="showProfileOptions"
          >
            <span class="mr-2">Hola:</span>
            <span class="font-semibold text-shori-gray-12">{{ user.getUserName }}</span>

            <FloatingOptions v-if="isProfileOptionsVisible" class="min-w-48">
              <template #options>
                <router-link
                  :to="{ name: 'myPurchases' }"
                  class="whitespace-nowrap px-4 py-2 hover:bg-shori-gray-3 transition-colors rounded"
                  >Mis compras</router-link
                >
              </template>
            </FloatingOptions>
          </div>
          <button
            @click="user.logout"
            class="flex items-center pl-4 hover:text-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/modules/auth/stores/user';
import FloatingOptions from './FloatingOptions.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useFilterCategoryStore } from '@/modules/filter/store/filterCategory';
import { useCartStore } from '@/modules/cart/stores/cart';
import ButtonLink from '@/modules/common/components/ButtonLink.vue';
import DashboardIcon from '@/modules/common/icons/DashboardIcon.vue';
import SocialsLinks from './SocialsLinks.vue';
import GeneralButton from '@/modules/common/components/GeneralButton.vue';

const user = useUserStore();
const cartStore = useCartStore();
const filters = useFilterCategoryStore();
const isProductOptionsVisible = ref(false);
const isProfileOptionsVisible = ref(false);

const route = useRoute();

onMounted(async () => {
  await user.setUser();
  await cartStore.getCart();
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
</script>
