<script lang="ts" setup>
import AdminLink from '@/modules/admin/components/AdminLink.vue';
import DashboardIcon from '@/modules/admin/components/icons/DashboardIcon.vue';
import ProductIcon from '@/modules/admin/components/icons/ProductIcon.vue';
import UsersIcon from '@/modules/admin/components/icons/UsersIcon.vue';
import SalesIcon from '@/modules/admin/components/icons/SalesIcon.vue';
import AppointmentIcon from '@/modules/admin/components/icons/AppointmentIcon.vue';
import PurchasesIcon from '@/modules/admin/components/icons/PurchasesIcon.vue';
import ServicesIcon from '@/modules/admin/components/icons/ServicesIcon.vue';
import CategoryIcon from '@/modules/common/icons/CategoryIcon.vue';
import BannerIcon from '@/modules/common/icons/BannerIcon.vue';
import TagIcon from '@/modules/common/icons/TagIcon.vue';
import DiscountIcon from '@/modules/common/icons/DiscountIcon.vue';
import HomeGoIcon from '@/modules/common/icons/HomeGoIcon.vue';
import GeneralButton from '@/modules/common/components/GeneralButton.vue';
import { useUserStore } from '@/modules/auth/stores/user';
import { useRouter } from 'vue-router';

const user = useUserStore();
const router = useRouter();

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
  router.push({ name: 'home' });
};
</script>
<template>
  <aside
    id="sidebar"
    class="fixed hidden z-20 h-full top-0 left-0 lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75"
    aria-label="Sidebar"
  >
    <div class="relative flex-1 flex flex-col min-h-0 bg-shori-gray-2 pt-0">
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

          <ul class="space-y-2 pb-2 flex-1">
            <li v-for="route in sidebarRoutes" :key="route.name">
              <AdminLink :route="route.name" :text="route.text" :icon="route.icon" />
            </li>
          </ul>

          <RouterLink :to="{ name: 'home' }">
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
