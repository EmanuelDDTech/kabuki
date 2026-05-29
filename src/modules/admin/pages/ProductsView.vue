<script lang="ts" setup>
import {
  computed,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';
import { useProductsStore } from '@/modules/products/stores/products';
import { formatCurrency } from '@/helpers';
import EditIcon from '@/modules/admin/components/icons/EditIcon.vue';
import Swal from 'sweetalert2';
import ProductAPI from '@/modules/product/api/ProductAPI';
import useImage from '@/modules/products/composables/useImage';
import { useInfiniteQuery } from '@tanstack/vue-query';
import type { ProductResponse } from '@/modules/products/interfaces';
import { useRoute } from 'vue-router';
import LoaderWithText from '@/modules/common/components/LoaderWithText.vue';
import SwitchButton from '@/modules/common/components/SwitchButton.vue';
import ProductsFiltersTopBar from '@/modules/filter/components/ProductsFiltersTopBar.vue';
import { useFilterCategoryStore } from '@/modules/filter/store/filterCategory';
import { getProductsCategoryId } from '@/composables/useProductsCategory';

const productStore = useProductsStore();
const filterStore = useFilterCategoryStore();

const route = useRoute();
const currentProductsCategoryId = computed(() => getProductsCategoryId(route.params.category));

onBeforeMount(async () => {
  await filterStore.findFilters(currentProductsCategoryId.value);
  await filterStore.getFilters();
});

watch(currentProductsCategoryId, async (newId) => {
  await filterStore.findFilters(newId);
  await filterStore.getFilters();
});

const toast: any = inject('toast');

const { deleteByProductId } = useImage();

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
  useInfiniteQuery<ProductResponse>({
    queryKey: computed(() => ['adminProducts', route.fullPath]),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return productStore.getProductsWithFilters(
        `${filterStore.createStringQuery}${pageParam ? `&page=${pageParam}` : ''}&limit=12`,
        currentProductsCategoryId.value,
      );
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ? lastPage.nextPage : undefined;
    },
    // staleTime: 1000 * 60 * 5,
  });

const loadMoreProductsRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
        fetchNextPage();
      }
    },
    {
      rootMargin: '100px',
    },
  );

  if (loadMoreProductsRef.value) {
    observer.observe(loadMoreProductsRef.value);
  }
});

onBeforeUnmount(() => {
  if (observer && loadMoreProductsRef.value) {
    observer.unobserve(loadMoreProductsRef.value);
  }
});

onUnmounted(async () => {
  filterStore.clearActiveFilters();
  productStore.clearProducts();
});
</script>

<template>
  <main class="mt-6 mx-4 p-4 sm:p-6 xl:p-8 bg-shori-gray-1 shadow rounded-lg">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-semibold mb-6">Administrar productos</h1>

      <RouterLink
        :to="{ name: 'adminCreateProduct' }"
        class="mb-6 w-36 self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm text-center p-2"
      >
        Crear Producto
      </RouterLink>
    </div>

    <ProductsFiltersTopBar />

    <section class="flex h-full flex-col justify-center">
      <div class="mx-auto w-full rounded-sm flex flex-col">
        <div class="overflow-x-auto">
          <LoaderWithText v-if="status === 'pending'" text="Cargando " />
          <div v-if="status === 'error'" class="text-center">Error al cargar</div>

          <table class="w-full table-auto">
            <thead
              class="shadow bg-shori-gray-2 text-xs font-semibold uppercase text-shori-gray-11"
            >
              <tr>
                <th>
                  <div class="text-left font-semibold">Imagen</div>
                </th>
                <th class="p-2">
                  <div class="text-left font-semibold">Nombre</div>
                </th>
                <th class="p-2">
                  <div class="text-left font-semibold">Disponibles</div>
                </th>
                <!-- <th class="p-2">
                  <div class="text-left font-semibold">Costo</div>
                </th> -->
                <th class="p-2">
                  <div class="text-left font-semibold">Precio</div>
                </th>
                <th class="p-2">
                  <div class="text-left font-semibold">Activo</div>
                </th>
                <th class="p-2">
                  <div class="text-center font-semibold">Action</div>
                </th>
              </tr>
            </thead>

            <tbody
              class="text-sm odd:bg-shori-gray-2 even:bg-shori-gray-1"
              v-for="product in data?.pages.flatMap((page) => page.data)"
              :key="product.id"
            >
              <tr>
                <td class="p-2">
                  <div class="w-32 h-32 flex items-center justify-center">
                    <img class="w-28 rounded-md" :src="product.url" alt="product image" />
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-base font-medium text-shori-gray-12">{{ product.name }}</div>
                </td>
                <td class="p-2">
                  <div class="text-base text-left">{{ product.stock }}</div>
                </td>
                <td class="p-2">
                  <div class="text-base text-left font-medium text-green-500">
                    {{ formatCurrency(product.price) }}
                  </div>
                </td>
                <td class="p-2">
                  <SwitchButton :id="product.id" :value="product.active" :disabled="true" />
                </td>
                <td class="p-2">
                  <div class="flex justify-center">
                    <RouterLink :to="{ name: 'adminUpdateProducts', params: { id: product.id } }">
                      <EditIcon
                        class="h-8 w-8 p-1 rounded-full hover:bg-shori-gray-3 hover:text-blue-600"
                      />
                    </RouterLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div ref="loadMoreProductsRef" style="height: 1px"></div>

          <LoaderWithText v-if="isFetchingNextPage" text="Cargando más" />

          <div v-else-if="!hasNextPage" class="mt-6 text-center">No hay más productos</div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* CHECKBOX TOGGLE SWITCH */
/* @apply rules for documentation, these do not work as inline style */
.toggle-checkbox {
  appearance: none !important;
}

.toggle-checkbox:checked {
  @apply: right-0 border-green-400;
  right: 0;
  border-color: #68d391;
}
.toggle-checkbox:checked + .toggle-label {
  @apply: bg-green-400;
  background-color: #68d391;
}
</style>
