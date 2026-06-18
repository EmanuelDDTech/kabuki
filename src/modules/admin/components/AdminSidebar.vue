<script lang="ts" setup>
import AdminLink from '@/modules/admin/components/AdminLink.vue';
import DashboardIcon from '@/modules/admin/components/icons/DashboardIcon.vue';
import ProductIcon from '@/modules/admin/components/icons/ProductIcon.vue';
import UsersIcon from '@/modules/admin/components/icons/UsersIcon.vue';
import SalesIcon from '@/modules/admin/components/icons/SalesIcon.vue';
import PurchasesIcon from '@/modules/admin/components/icons/PurchasesIcon.vue';
import CategoryIcon from '@/modules/common/icons/CategoryIcon.vue';
import BannerIcon from '@/modules/common/icons/BannerIcon.vue';
import TagIcon from '@/modules/common/icons/TagIcon.vue';
import DiscountIcon from '@/modules/common/icons/DiscountIcon.vue';
import HomeGoIcon from '@/modules/common/icons/HomeGoIcon.vue';
import GeneralButton from '@/modules/common/components/GeneralButton.vue';
import LogoutIcon from '@/modules/common/icons/LogoutIcon.vue';
import { useUserStore } from '@/modules/auth/stores/user';
import { useRouter } from 'vue-router';
import ThemeToggle from '@/modules/common/components/ThemeToggle.vue';

const user = useUserStore();
const router = useRouter();

withDefaults(
  defineProps<{
    isMobileOpen?: boolean;
  }>(),
  {
    isMobileOpen: false,
  },
);

const emit = defineEmits<{
  (event: 'closeMobile'): void;
}>();

const sidebarRoutes = [
  { name: 'adminDashboard', text: 'Dashboard', icon: DashboardIcon },
  { name: 'sales', text: 'Ventas', icon: SalesIcon },
  { name: 'purchases', text: 'Compras', icon: PurchasesIcon },
  // { name: 'appointments', text: 'Citas', icon: AppointmentIcon },
  { name: 'adminProducts', text: 'Productos', icon: ProductIcon },
  { name: 'adminFeaturedProducts', text: 'Productos destacados', icon: ProductIcon },
  { name: 'adminCategories', text: 'Categorías', icon: CategoryIcon },
  { name: 'adminBanners', text: 'Banners', icon: BannerIcon },
  // { name: 'adminServices', text: 'Servicios', icon: ServicesIcon },
  { name: 'adminCampaigns', text: 'Campañas', icon: TagIcon },
  { name: 'adminDiscountCodes', text: 'Códigos Descuento', icon: DiscountIcon },
  { name: 'adminUsers', text: 'Users', icon: UsersIcon },
];

const logout = () => {
  user.logout();
  emit('closeMobile');
  router.push({ name: 'home' });
};

const closeMobile = () => {
  emit('closeMobile');
};
</script>
<template>
  <aside
    id="sidebar"
    class="fixed z-40 h-full top-0 left-0 flex flex-shrink-0 flex-col w-64 transition-transform duration-300 ease-out lg:translate-x-0"
    :class="isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    aria-label="Sidebar"
  >
    <div class="relative flex-1 flex flex-col min-h-0 bg-shori-gray-2 pt-0">
      <!-- <button
        type="button"
        class="absolute right-3 top-3 rounded-lg p-2 text-shori-gray-12 transition-colors hover:bg-shori-gray-3 lg:hidden"
        @click="closeMobile"
      >
        <span class="sr-only">Cerrar menú lateral</span>
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button> -->

      <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div class="flex-1 px-3 flex flex-col gap-8">
          <RouterLink :to="{ name: 'admin' }" class="text-xl font-bold flex items-center lg:ml-2.5">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fshorikame-logo(1).webp?alt=media&token=a23cdef9-79f4-4de9-9aee-e968ef1f9bb0"
              class="h-10 mr-2"
              alt="ShoriKameCards Logo"
            />
            <span class="text-body-normal self-center whitespace-nowrap">Shorikame Cards</span>
          </RouterLink>

          <div class="flex justify-end">
            <ThemeToggle class="hidden lg:block" />
          </div>

          <ul class="space-y-2 pb-2 flex-1">
            <li v-for="route in sidebarRoutes" :key="route.name" @click="closeMobile">
              <AdminLink :route="route.name" :text="route.text" :icon="route.icon" />
            </li>
          </ul>

          <RouterLink :to="{ name: 'home' }" @click="closeMobile">
            <GeneralButton :text="'Ir a la página'" :icon="HomeGoIcon" width="full" />
          </RouterLink>

          <!-- <RouterLink
            :to="{ name: 'register' }"
            class="flex items-center pr-4 hover:text-blue-500 transition-colors"
            ><p>
              Hola: <span class="font-bold"> {{ user.getUserName }} </span>
            </p>
          </RouterLink> -->
          <button @click="logout" class="flex justify-center hover:text-red-500 transition-colors">
            Cerrar sesión
            <LogoutIcon class="w-6" />
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
