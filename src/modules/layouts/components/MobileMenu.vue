<template>
  <aside ref="mobileMenuRef" class="w-[22rem] max-w-[92vw] h-screen" aria-label="Sidebar">
    <div
      class="h-full overflow-y-auto rounded-2xl border border-shori-gray-6 bg-gradient-to-b from-shori-gray-1 via-shori-gray-2 to-shori-gray-1 shadow-2xl"
    >
      <div
        class="sticky top-0 z-10 border-b border-shori-gray-6 bg-shori-gray-1/90 px-4 py-4 backdrop-blur"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] tracking-[0.14em] uppercase text-shori-gray-9">Menú</p>
            <p class="text-base font-bold text-shori-gray-12">Explora ShoriKameCards</p>
          </div>
          <button
            type="button"
            class="rounded-xl p-1.5 text-shori-gray-11 transition-colors hover:bg-shori-gray-3"
            aria-label="Cerrar menu"
            @click="emit('hideMenu')"
          >
            <XMarkIcon class="w-7 aspect-square" />
          </button>
        </div>

        <div class="mt-3 flex justify-end">
          <ThemeToggle />
        </div>
      </div>

      <div class="px-4 py-4 space-y-4">
        <div class="space-y-2 rounded-xl border border-shori-gray-6 bg-shori-gray-1/70 p-2">
          <router-link
            :to="{ name: 'cart' }"
            class="flex items-center rounded-lg px-2.5 py-2 text-sm font-semibold text-shori-gray-12 transition-colors hover:bg-shori-gray-3"
            :class="route.name === 'cart' ? 'bg-shori-gray-3' : ''"
          >
            <CartIcon class="h-5 w-5" />
            <span class="ml-3">Carrito</span>
          </router-link>

          <router-link
            :to="{ name: 'myPurchases' }"
            class="flex items-center rounded-lg px-2.5 py-2 text-sm font-semibold text-shori-gray-12 transition-colors hover:bg-shori-gray-3"
            :class="route.name === 'myPurchases' ? 'bg-shori-gray-3' : ''"
          >
            <PurchasesIcon class="h-5 w-5" />
            <span class="ml-3">Mis compras</span>
          </router-link>
        </div>

        <section class="rounded-xl border border-shori-gray-6 bg-shori-gray-1/70 p-3">
          <div class="flex items-center gap-2">
            <ProductIcon class="h-5 w-5 text-shori-gray-11" />
            <h2 class="text-sm font-bold tracking-wide text-shori-gray-12">Productos</h2>
          </div>

          <div class="mt-3 space-y-3">
            <article
              v-for="category in mobileProductCategories"
              :key="category.category"
              class="rounded-xl border border-shori-gray-6 bg-shori-gray-1/60 p-3"
              :class="[
                category.accentClass,
                isCategoryActive(category.category)
                  ? 'ring-1 ring-shori-green-8 border-shori-green-8'
                  : '',
              ]"
            >
              <RouterLink
                :to="{ name: 'products', params: { category: category.category } }"
                class="text-sm font-bold text-shori-gray-12 transition-colors hover:text-shori-green-10"
              >
                {{ category.label }}
              </RouterLink>

              <div v-if="category.productTypes.length" class="mt-2">
                <p class="text-[10px] uppercase tracking-[0.12em] text-shori-gray-9">Tipos</p>
                <div class="mt-1.5 flex flex-wrap gap-1.5">
                  <RouterLink
                    v-for="productType in category.productTypes"
                    :key="`${category.category}-${productType.value}`"
                    :to="{
                      name: 'products',
                      params: { category: category.category },
                      query: { 'tipo-de-producto': productType.value },
                    }"
                    class="rounded-md border border-shori-gray-6 px-2 py-1 text-[11px] font-medium text-shori-gray-11 transition-colors hover:border-shori-green-8 hover:text-shori-green-10"
                  >
                    {{ productType.label }}
                  </RouterLink>
                </div>
              </div>

              <div v-if="category.latestExpansions.length" class="mt-2">
                <p class="text-[10px] uppercase tracking-[0.12em] text-shori-gray-9">Expansiones</p>
                <div class="mt-1.5 flex flex-wrap gap-1.5">
                  <RouterLink
                    v-for="expansion in category.latestExpansions"
                    :key="`${category.category}-${expansion.value}`"
                    :to="{
                      name: 'products',
                      params: { category: category.category },
                      query: { expansion: expansion.value },
                    }"
                    class="rounded-md border border-shori-gray-6 px-2 py-1 text-[11px] font-medium text-shori-gray-11 transition-colors hover:border-shori-green-8 hover:text-shori-green-10"
                  >
                    {{ expansion.label }}
                  </RouterLink>
                </div>
              </div>
            </article>
          </div>
        </section>

        <router-link
          v-if="user.isSet"
          :to="{ name: 'myPurchases' }"
          class="flex items-center rounded-xl border border-shori-gray-6 bg-shori-gray-1/70 px-3 py-2 text-sm font-semibold text-shori-gray-12 transition-colors hover:bg-shori-gray-3"
        >
          <ProfileIcon class="h-5 w-5" />
          <span class="ml-3 whitespace-nowrap">{{ user.getUserName }}</span>
        </router-link>

        <div class="space-y-2 p-2">
          <ButtonLink
            v-if="!user.isSet"
            to="login"
            text="Iniciar sesión"
            type="primary"
            size="small"
            width="full"
            :icon="LoginIcon"
          />

          <ButtonLink
            v-if="!user.isSet"
            to="register"
            text="Registrarse"
            type="secondary"
            size="small"
            width="full"
            :icon="SignupIcon"
          />

          <button
            v-if="user.isSet"
            type="button"
            @click="user.logout"
            class="flex w-full items-center rounded-lg px-2.5 py-2 text-sm font-semibold text-shori-red-9 transition-colors hover:bg-shori-red-3/30"
          >
            <LogoutIcon class="h-5 w-5" />
            <span class="ml-3 whitespace-nowrap">Cerrar sesión</span>
          </button>
        </div>

        <div class="rounded-xl border border-shori-gray-6 bg-shori-gray-1/70 px-3 py-2">
          <SocialsLinks class="justify-start" />
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
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
import ThemeToggle from '@/modules/common/components/ThemeToggle.vue';
import { useProductsCategory, type ProductCategory } from '@/composables/useProductsCategory';

const emit = defineEmits<{ (event: 'hideMenu'): void }>();

interface ProductShortcut {
  label: string;
  category: ProductCategory;
  accentClass: string;
  productTypes: Array<{ label: string; value: string }>;
  latestExpansions: Array<{ label: string; value: string }>;
}

const route = useRoute();
const user = useUserStore();
const { currentProductsCategory } = useProductsCategory();
const mobileMenuRef = ref<HTMLElement | null>(null);

const mobileProductCategories: ProductShortcut[] = [
  {
    label: 'Pokemon',
    category: 'pokemon',
    accentClass: 'bg-gradient-to-br from-amber-200/30 via-transparent to-orange-400/15',
    productTypes: [
      { label: 'Booster Box', value: 'booster-box' },
      { label: 'Elite Trainer Box', value: 'elite-trainer-box' },
      { label: 'Premium Collection', value: 'premium-collection' },
    ],
    latestExpansions: [
      { label: 'Perfect Order', value: 'perfect-order' },
      { label: 'Ascended Heroes', value: 'ascended-heroes' },
      { label: 'Phantasmal Flames', value: 'phantasmal-flames' },
      { label: 'Mega Evolutions', value: 'mega-evolution' },
      { label: 'Destined Rivals', value: 'destined-rivals' },
    ],
  },
  {
    label: 'Magic',
    category: 'magic',
    accentClass: 'bg-gradient-to-br from-emerald-200/30 via-transparent to-teal-400/15',
    productTypes: [
      { label: 'Producto Sellado', value: 'producto-sellado' },
      { label: 'Bundles', value: 'bundles' },
    ],
    latestExpansions: [
      { label: 'Teenage Mutant Ninja Turtles', value: 'teenage-mutant-ninja-turtles' },
    ],
  },
  {
    label: 'Riftbound',
    category: 'riftbound',
    accentClass: 'bg-gradient-to-br from-sky-200/30 via-transparent to-cyan-400/20',
    productTypes: [
      { label: 'Booster Display', value: 'booster-display' },
      { label: 'Decks', value: 'decks' },
    ],
    latestExpansions: [{ label: 'Spiritforged', value: 'spiritforged' }],
  },
];

const isProductsRoute = computed(() => route.name === 'products');

const toRouteString = (value: unknown) => {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return typeof value === 'string' ? value : '';
};

const isCategoryActive = (category: ProductCategory) =>
  isProductsRoute.value && toRouteString(route.params.category) === category;

const handleOutsidePointerDown = (event: PointerEvent) => {
  const target = event.target;

  if (!(target instanceof Node)) {
    return;
  }

  if (mobileMenuRef.value?.contains(target)) {
    return;
  }

  emit('hideMenu');
};

onMounted(() => {
  document.addEventListener('pointerdown', handleOutsidePointerDown);
});

onUnmounted(() => {
  document.removeEventListener('pointerdown', handleOutsidePointerDown);
});
</script>
