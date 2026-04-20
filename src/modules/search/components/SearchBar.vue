<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue';
import { useProductStore } from '@/modules/product/stores/product';
import ProductSearch from './ProductSearch.vue';
import { useRouter } from 'vue-router';

interface Props {
  inputId?: string;
  autoFocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  inputId: 'global-product-search',
  autoFocus: false,
});

const product = useProductStore();
const router = useRouter();
const isFocused = shallowRef(false);
const searchInputRef = ref<HTMLInputElement | null>(null);

const hasQuery = computed(() => product.searchQuery.trim().length > 0);
const hasResults = computed(() => product.searchedProducts.length > 0);

const selectProduct = (id: number) => {
  product.findProduct(id);
  router.push({ name: 'product', params: { id: id } });
  product.clearSearchQuery();
};

const clearSearch = () => {
  product.clearSearchQuery();
};

const focusInput = async () => {
  await nextTick();
  searchInputRef.value?.focus();
};

onMounted(() => {
  if (props.autoFocus) {
    void focusInput();
  }
});

watch(
  () => props.autoFocus,
  (shouldFocus) => {
    if (shouldFocus) {
      void focusInput();
    }
  },
);
</script>

<template>
  <div class="search-bar relative w-full">
    <div class="search-shell group flex items-center">
      <button
        type="button"
        class="search-icon flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300"
        aria-label="Buscar productos"
        :class="isFocused || hasQuery ? 'text-shori-green-11' : 'text-shori-gray-10'"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </button>

      <label :for="props.inputId" class="sr-only">Buscar productos</label>
      <input
        :id="props.inputId"
        ref="searchInputRef"
        type="search"
        class="search-input w-full bg-transparent pr-2 text-shori-gray-12 focus:outline-none"
        placeholder="Busca cartas, decks o colecciones"
        v-model="product.searchQuery"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      <button
        v-if="hasQuery"
        type="button"
        class="search-clear mr-2 flex h-8 w-8 items-center justify-center rounded-full text-shori-gray-10 transition-all duration-300 hover:bg-shori-gray-4 hover:text-shori-gray-12"
        aria-label="Limpiar busqueda"
        @click="clearSearch"
      >
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>

    <Transition name="search-results">
      <div
        v-if="hasResults"
        class="search-results absolute left-0 top-[calc(100%+0.75rem)] z-30 w-full sm:left-1/2 sm:w-[min(92vw,1040px)] sm:-translate-x-1/2"
      >
        <div
          class="search-results-panel rounded-2xl border border-shori-gray-6 p-3 shadow-2xl sm:p-4"
        >
          <div
            class="w-full max-h-[68vh] overflow-y-auto scrollbar-thin scrollbar-thumb-shori-gray-6 scrollbar-track-transparent sm:max-h-[560px]"
          >
            <ul class="grid grid-cols-1 gap-3 min-[500px]:grid-cols-2 lg:grid-cols-3">
              <ProductSearch
                v-for="productData in product.searchedProducts"
                :key="productData.id"
                :product="productData"
                @select-product="selectProduct"
              ></ProductSearch>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.search-shell {
  min-height: 2.5rem;
  border: 1px solid var(--gray-6);
  border-radius: 9999px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--gray-1) 92%, white 8%),
    color-mix(in srgb, var(--gray-2) 88%, transparent)
  );
  box-shadow: 0 8px 24px color-mix(in srgb, var(--gray-10) 10%, transparent);
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.search-shell:focus-within {
  border-color: var(--green-7);
  /* box-shadow:
    0 0 0 4px color-mix(in srgb, var(--green-6) 30%, transparent),
    0 16px 32px color-mix(in srgb, var(--green-10) 18%, transparent); */
  transform: translateY(-1px);
}

.search-icon {
  margin-left: 0.35rem;
}

.search-input {
  font-size: 0.95rem;
}

.search-input::placeholder {
  color: var(--gray-10);
  transition: opacity 0.25s ease;
}

.search-shell:focus-within .search-input::placeholder {
  opacity: 0.7;
}

.search-results-panel {
  background-color: var(--gray-1);
  box-shadow:
    0 4px 6px -1px color-mix(in srgb, var(--gray-12) 8%, transparent),
    0 20px 48px -8px color-mix(in srgb, var(--gray-12) 20%, transparent);
  animation: search-panel-pulse 0.45s ease;
}

.search-results-enter-active,
.search-results-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.28s ease;
}

.search-results-enter-from,
.search-results-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

@keyframes search-panel-pulse {
  0% {
    filter: saturate(0.86);
  }
  100% {
    filter: saturate(1);
  }
}

@media (max-width: 640px) {
  .search-input {
    font-size: 0.9rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .search-shell,
  .search-results-enter-active,
  .search-results-leave-active,
  .search-results-panel {
    animation: none;
    transition: none;
  }
}
</style>
