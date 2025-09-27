<template>
  <aside class="w-64 h-screen" aria-label="Sidebar">
    <div
      class="px-4 py-4 h-full overflow-y-auto rounded-lg bg-white shadow-lg border border-gray-100"
    >
      <ul class="h-full gap-2 flex flex-col justify-start">
        <li class="flex items-center justify-end">
          <XMarkIcon
            @click="$emit('hideMenu')"
            class="w-7 mr-3 aspect-square text-gray-400 hover:bg-gray-100 rounded-lg"
          />
        </li>
        <li>
          <router-link
            :to="{ name: 'cart' }"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            :class="router.name === 'cart' ? 'bg-gray-100' : ''"
          >
            <CartIcon class="w-6 h-6 transition duration-75 group-hover:text-gray-900" />
            <span class="ml-3">Carrito</span>
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'myPurchases' }"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <PurchasesIcon
              class="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-gray-900"
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
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <svg
              class="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900"
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
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            :class="router.name === 'products' ? 'bg-gray-100' : ''"
          >
            <ProductIcon
              class="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-gray-900"
            />
            <span class="flex-1 ml-3 whitespace-nowrap">Productos</span>
          </router-link>
        </li>

        <li v-if="user.isSet">
          <router-link
            :to="{ name: 'myPurchases' }"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ProfileIcon
              class="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-gray-900"
            />
            <span class="flex-1 ml-3 whitespace-nowrap">{{ user.getUserName }}</span>
          </router-link>
        </li>

        <div class="flex-1 flex-col flex justify-end mt-4">
          <div v-if="!user.isSet">
            <router-link
              :to="{ name: 'login' }"
              class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <LoginIcon
                class="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-gray-900"
              />
              <span class="flex-1 ml-3 whitespace-nowrap">Ingresar</span>
            </router-link>
          </div>
          <div v-if="!user.isSet">
            <router-link
              :to="{ name: 'register' }"
              class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <RegisterIco
                class="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-gray-900"
              />
              <span class="flex-1 ml-3 whitespace-nowrap">Registrarse</span>
            </router-link>
          </div>

          <div v-if="user.isSet">
            <button
              @click="user.logout"
              class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <LogoutIcon
                class="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-gray-900"
              />
              <span class="flex-1 ml-3 whitespace-nowrap">Cerrar sesión</span>
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

defineEmits(['hideMenu']);

const router = useRoute();
const user = useUserStore();
</script>
