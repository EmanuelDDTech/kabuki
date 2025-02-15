<template>
  <div class="border-b-2 border-gray-200 px-3">
    <div class="flex justify-center lg:justify-end items-center max-w-7xl mx-auto py-2">
      <RouterLink :to="{ name: 'home' }" class="text-2xl font-bold lg:hidden flex">
        <img src="@/assets/img/shorikame-logo-edited.webp" class="h-12 mr-2" alt="Windster Logo" />
        <span class="self-center whitespace-nowrap">ShoriKameCards</span>
      </RouterLink>
      <!-- <SearchBar /> -->
      <nav class="text-base hidden lg:flex">
        <div class="flex gap-3 border-r-2 border-gray-300 text-gray-400">
          <RouterLink
            :to="{ name: 'home' }"
            class="flex items-center pr-4 hover:text-blue-500 transition-colors"
            >Sobre Nosotros</RouterLink
          >
          <RouterLink
            :to="{ name: 'home' }"
            class="flex items-center pr-4 hover:text-blue-500 transition-colors"
            >Promociones</RouterLink
          >
          <!-- <RouterLink
            :to="{ name: 'home' }"
            class="flex items-center pr-4 hover:text-blue-500 transition-colors"
            >Registrarse</RouterLink
          > -->
        </div>
        <div class="flex pl-4 font-semibold" v-if="!user.isSet">
          <RouterLink
            :to="{ name: 'register' }"
            class="flex items-center pr-4 border-r-2 border-gray-300 hover:text-blue-500 transition-colors"
            >Registrarse</RouterLink
          >
          <RouterLink
            :to="{ name: 'login' }"
            class="flex items-center pl-4 hover:text-blue-500 transition-colors"
            >Ingresar</RouterLink
          >
        </div>
        <div class="flex pl-4 font-semibold" v-if="user.isSet">
          <RouterLink
            :to="{ name: 'register' }"
            class="flex items-center pr-4 border-r-2 border-gray-300 hover:text-blue-500 transition-colors"
            >Hola: {{ user.getUserName }}</RouterLink
          >
          <button
            @click="user.logout"
            class="flex items-center pl-4 hover:text-blue-500 transition-colors"
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

const user = useUserStore();
</script>
