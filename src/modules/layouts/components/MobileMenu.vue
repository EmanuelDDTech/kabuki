<template>
  <aside class="w-56 h-screen" aria-label="Sidebar">
    <div
      class="px-4 py-4 h-full overflow-y-auto rounded-lg bg-shori-gray-2 shadow-lg border border-shori-gray-6"
    >
      <ul class="h-full gap-2 flex flex-col justify-start">
        <li class="flex items-center justify-end">
          <XMarkIcon
            @click="$emit('hideMenu')"
            class="w-7 mr-3 aspect-square text-shori-gray-11 hover:bg-shori-gray-3 rounded-lg cursor-pointer"
          />
        </li>
        <li>
          <router-link
            :to="{ name: 'cart' }"
            class="flex items-center p-2 text-base font-normal text-shori-gray-12 rounded-lg hover:bg-shori-gray-3"
            :class="router.name === 'cart' ? 'bg-shori-gray-3' : ''"
          >
            <CartIcon class="w-6 h-6 transition duration-75 group-hover:text-shori-gray-12" />
            <span class="ml-3">Carrito</span>
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'myPurchases' }"
            class="flex items-center p-2 text-base font-normal text-shori-gray-12 rounded-lg hover:bg-shori-gray-3"
          >
            <PurchasesIcon
              class="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-shori-gray-12"
            />
            <span class="flex-1 ml-3 whitespace-nowrap">Mis compras</span>
            <!-- <span
              class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full"
              >Pro</span
            > -->
          </router-link>
        </li>
        <!-- <li>
          <a
            href="#"
            target="_blank"
            class="flex items-center p-2 text-base font-normal text-shori-gray-12 rounded-lg hover:bg-shori-gray-3"
          >
            <svg
              class="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 group-hover:text-shori-gray-12"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"
              ></path>
              <path
                d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
              ></path>
            </svg>
            <span class="flex-1 ml-3 whitespace-nowrap">Me gusta</span>
          </a>
        </li> -->
        <li>
          <router-link
            :to="{ name: 'products' }"
            class="flex items-center p-2 text-base font-normal text-shori-gray-12 rounded-lg hover:bg-shori-gray-3"
            :class="router.name === 'products' ? 'bg-shori-gray-3' : ''"
          >
            <ProductIcon
              class="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-shori-gray-12"
            />
            <span class="flex-1 ml-3 whitespace-nowrap">Productos</span>
          </router-link>
        </li>

        <li v-if="user.isSet">
          <router-link
            :to="{ name: 'myPurchases' }"
            class="flex items-center p-2 text-base font-normal text-shori-gray-12 rounded-lg hover:bg-shori-gray-3"
          >
            <ProfileIcon
              class="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-shori-gray-12"
            />
            <span class="flex-1 ml-3 whitespace-nowrap">{{ user.getUserName }}</span>
          </router-link>
        </li>

        <div class="flex-1 flex-col flex justify-end mt-4">
          <ButtonLink
            v-if="!user.isSet"
            to="login"
            text="Iniciar sesión"
            type="primary"
            size="small"
            :icon="LoginIcon"
            class="my-2"
          />

          <ButtonLink
            v-if="!user.isSet"
            to="register"
            text="Registrarse"
            type="secondary"
            size="small"
            :icon="SignupIcon"
            class="mb-4"
          />

          <div v-if="user.isSet" class="mb-4">
            <button
              @click="user.logout"
              class="flex w-full justify-start items-center p-2 text-base font-normal text-shori-gray-12 rounded-lg hover:bg-shori-gray-3"
            >
              <LogoutIcon
                class="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-shori-gray-12"
              />
              <span class="ml-3 whitespace-nowrap">Cerrar sesión</span>
            </button>
          </div>
          <SocialsLinks />
        </div>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import XMarkIcon from './XMarkIcon.vue';
import { useUserStore } from '@/modules/auth/stores/user';
import SocialsLinks from './SocialsLinks.vue';
import CartIcon from '@/modules/cart/components/CartIcon.vue';
import PurchasesIcon from '@/modules/admin/components/icons/PurchasesIcon.vue';
import ProductIcon from '@/modules/admin/components/icons/ProductIcon.vue';
import ProfileIcon from '@/modules/common/icons/ProfileIcon.vue';
import LogoutIcon from '@/modules/common/icons/LogoutIcon.vue';
import LoginIcon from '@/modules/common/icons/LoginIcon.vue';
import SignupIcon from '@/modules/common/icons/SignupIcon.vue';
import ButtonLink from '@/modules/common/components/ButtonLink.vue';

defineEmits(['hideMenu']);

const router = useRoute();
const user = useUserStore();
</script>
