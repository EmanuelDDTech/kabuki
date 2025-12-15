<template>
  <footer class="border-t-2 border-shori-gray-6 px-3">
    <div
      class="bg-shori-gray-1 flex flex-col lg:flex-row gap-3 items-center justify-center md:justify-between py-6 max-w-screen-xl mx-auto"
    >
      <span class="text-sm text-shori-gray-11 sm:text-center"
        >© {{ new Date().getFullYear() }}
        <a href="" class="hover:text-blue-500" target="_blank">Shori Kame Cards</a>
      </span>

      <SocialsLinks />

      <ul class="flex flex-wrap items-center mt-3 sm:mt-0 text-shori-gray-11">
        <li>
          <router-link
            :to="{ name: 'frequentQuestions' }"
            class="mr-4 text-sm hover:text-blue-500 md:mr-6"
            >Preguntas frecuentes</router-link
          >
        </li>
        <!-- <li>
          <router-link
            :to="{ name: 'returnPolicy' }"
            class="mr-4 text-sm hover:text-blue-500 md:mr-6"
            >Política de Devolución</router-link
          >
        </li> -->
        <li>
          <router-link
            :to="{ name: 'termsAndQuestions' }"
            class="mr-4 text-sm hover:text-blue-500 md:mr-6"
            >Términos y Condiciones</router-link
          >
        </li>
        <!-- <li>
          <a href="#" class="mr-4 text-sm hover:text-blue-500 md:mr-6">Contacto</a>
        </li> -->
        <li>
          <router-link :to="{ name: 'privacy' }" class="text-sm hover:text-blue-500"
            >Política de privacidad</router-link
          >
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup lang="ts">
import SocialsLinks from './SocialsLinks.vue';
</script>

<style scoped></style>
