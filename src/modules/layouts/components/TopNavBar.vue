<template>
  <header
    id="site-header"
    class="sticky z-999 px-3 transition-all duration-500"
    :class="isHeaderHidden ? '-top-24' : 'top-2'"
  >
    <div
      class="max-w-7xl mx-auto rounded-2xl border border-shori-gray-6 backdrop-blur-sm"
      style="background-color: color-mix(in srgb, var(--gray-1) 84%, transparent)"
      @mouseleave="hideOptions"
    >
      <div class="flex items-center gap-3 px-4 py-3 lg:px-6">
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-3 shrink-0">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fshorikame-logo(1).webp?alt=media&token=a23cdef9-79f4-4de9-9aee-e968ef1f9bb0"
            class="h-12 w-12 rounded-xl object-cover"
            alt="ShoriKameCards"
          />
          <div class="hidden sm:flex flex-col leading-tight">
            <span class="text-lg font-extrabold text-shori-gray-12">ShoriKameCards</span>
            <!-- <span class="text-xs text-shori-gray-10">Pokemon TCG Store</span> -->
          </div>
        </RouterLink>

        <div class="hidden lg:flex flex-1 max-w-xl relative px-2">
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
                <div class="grid grid-cols-2 gap-3 min-w-[46rem] p-1">
                  <div
                    v-for="category in productCategories"
                    :key="category.category"
                    class="group relative overflow-hidden rounded-xl border border-shori-gray-6 bg-shori-gray-1/80 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-shori-green-8 hover:shadow-lg"
                    :class="[
                      category.accentClass,
                      currentProductsCategory === category.category
                        ? 'ring-1 ring-shori-green-8 border-shori-green-8'
                        : '',
                    ]"
                  >
                    <span
                      class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-shori-green-8/70 to-transparent"
                    ></span>

                    <RouterLink
                      :to="{ name: 'products', params: { category: category.category } }"
                      class="font-bold text-[0.95rem] text-shori-gray-12 tracking-wide hover:text-shori-green-10 transition-colors"
                      @click="handleCategoryClick"
                    >
                      {{ category.label }}
                    </RouterLink>

                    <div class="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <p class="text-[11px] uppercase tracking-[0.12em] text-shori-gray-9 mb-1.5">
                          Tipos de producto
                        </p>
                        <ul class="space-y-1.5">
                          <li
                            v-for="productType in category.productTypes"
                            :key="`${category.category}-${productType.value}`"
                          >
                            <RouterLink
                              :to="{
                                name: 'products',
                                params: { category: category.category },
                                query: { 'tipo-de-producto': productType.value },
                              }"
                              class="text-xs text-shori-gray-11 hover:text-shori-green-10 transition-colors"
                              @click="handleCategoryClick"
                            >
                              {{ productType.label }}
                            </RouterLink>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <p class="text-[11px] uppercase tracking-[0.12em] text-shori-gray-9 mb-1.5">
                          Ultimas expansiones
                        </p>
                        <ul class="space-y-1.5">
                          <li
                            v-for="expansion in category.latestExpansions"
                            :key="`${category.category}-${expansion.value}`"
                          >
                            <RouterLink
                              :to="{
                                name: 'products',
                                params: { category: category.category },
                                query: { expansion: expansion.value },
                              }"
                              class="text-xs text-shori-gray-11 hover:text-shori-green-10 transition-colors"
                              @click="handleCategoryClick"
                            >
                              {{ expansion.label }}
                            </RouterLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
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
import { useProductsCategory, type ProductCategory } from '@/composables/useProductsCategory';

const user = useUserStore();
const cartStore = useCartStore();
const filters = useFilterCategoryStore();
const isProductOptionsVisible = ref(false);
const isProfileOptionsVisible = ref(false);
const showMobileMenu = ref(false);
const isHeaderHidden = ref(false);
let lastScrollTop = 0;

const route = useRoute();
const { currentProductsCategory } = useProductsCategory();

interface ProductCategoryLink {
  label: string;
  category: ProductCategory;
  accentClass: string;
  productTypes: Array<{ label: string; value: string }>;
  latestExpansions: Array<{ label: string; value: string }>;
}

const productCategories: ProductCategoryLink[] = [
  {
    label: 'Pokemon',
    category: 'pokemon',
    accentClass: 'bg-gradient-to-br from-amber-200/30 via-transparent to-orange-400/15',
    productTypes: [
      { label: 'Booster Box', value: 'booster-box' },
      { label: 'Elite Trainer Box', value: 'elite-trainer-box' },
      { label: 'Premium Collection', value: 'premium-collection' },
      // { label: 'Carta suelta', value: 'cartas-sueltas' },
      // { label: 'Deck competitivo', value: 'decks-competitivos' },
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
      // { label: 'Booster Box', value: 'booster-box' },
      { label: 'Producto Sellado', value: 'producto-sellado' },
      { label: 'Bundles', value: 'bundles' },
      // { label: 'Carta suelta', value: 'cartas-sueltas' },
      // { label: 'Deck competitivo', value: 'decks-competitivos' },
    ],
    latestExpansions: [
      // { label: 'Duskmourn', value: 'duskmourn' },
      // { label: 'Outlaws of Thunder Junction', value: 'outlaws-of-thunder-junction' },
      // { label: 'Murders at Karlov Manor', value: 'murders-at-karlov-manor' },
      // { label: 'Bloomburrow', value: 'bloomburrow' },
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
      // { label: 'Bundle', value: 'bundle' },
      // { label: 'Carta suelta', value: 'cartas-sueltas' },
      // { label: 'Deck competitivo', value: 'decks-competitivos' },
    ],
    latestExpansions: [
      // { label: 'Origins', value: 'origins' },
      // { label: 'Awakenings', value: 'awakenings' },
      // { label: 'Embers of War', value: 'embers-of-war' },
      // { label: 'Chronicles', value: 'chronicles' },
      { label: 'Spiritforged', value: 'spiritforged' },
    ],
  },
  {
    label: 'Otros',
    category: 'otros',
    accentClass: 'bg-gradient-to-br from-zinc-200/35 via-transparent to-slate-400/20',
    productTypes: [
      { label: 'Micas', value: 'micas' },
      // { label: 'Accesorios', value: 'accesorios' },
      // { label: 'Fundas y sleeves', value: 'fundas-y-sleeves' },
      // { label: 'Binders', value: 'binders' },
      // { label: 'Deck box', value: 'deck-box' },
    ],
    latestExpansions: [
      // { label: 'Coleccion Especial 151', value: '151' },
      // { label: 'Mega Evolution', value: 'mega-evolution' },
      // { label: 'Destined Rivals', value: 'destined-rivals' },
      // { label: 'Journey Together', value: 'journey-together' },
      // { label: 'Temporal Forces', value: 'temporal-forces' },
    ],
  },
];

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

const handleCategoryClick = () => {
  hideProductOptions();
  updateProducts();
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
