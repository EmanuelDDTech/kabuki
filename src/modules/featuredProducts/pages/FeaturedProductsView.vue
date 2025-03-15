<script lang="ts" setup>
import { useFeaturedProductStore } from '@/modules/layouts/stores/featuredProduct';
import { inject, onMounted } from 'vue';
import { Sortable } from '@shopify/draggable';
import DeleteIcon from '@/modules/common/icons/DeleteIcon.vue';
import DraggableIcon from '@/modules/common/icons/DraggableIcon.vue';
import ProductCard from '@/modules/products/components/ProductCard.vue';
import AdminSearchBar from '@/modules/product/components/AdminSearchBar.vue';
import type { Product } from '@/modules/product/interfaces/product.interface';
import Swal from 'sweetalert2';
import { element } from '@vueform/vueform';

const featuredProductStore = useFeaturedProductStore();

const toast: any = inject('toast');

onMounted(async () => {
  await featuredProductStore.getFeaturedProducts();
});

onMounted(() => {
  const sortable = new Sortable(document.querySelector('#draggable'), {
    draggable: '.draggable-item',
    handle: '.handle',
  });

  sortable.on('sortable:start', (e) => {
    if (featuredProductStore.isLoading) {
      e.cancel();
    }
  });
  sortable.on('sortable:stop', (e) => saveSortedFeaturedProducts(e));
});

const addProduct = async (product: Product) => {
  try {
    await featuredProductStore.addFeaturedProduct(product);
    toast.open({
      message: 'Producto destacado añadido correctamente',
      type: 'success',
    });
  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};

const deleteFeaturedProductConfirmation = async (id: number) => {
  Swal.fire({
    title: 'Seguro quieres eliminar este producto destacado?',
    text: 'No podrá ser revertido!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Eliminar!',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      deleteFeaturedProduct(id);
    }
  });
};

const deleteFeaturedProduct = async (id: number) => {
  try {
    await featuredProductStore.deleteFeaturedProduct(id);

    toast.open({
      message: 'Producto destacado eliminado correctamente',
      type: 'success',
    });
  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};

const saveSortedFeaturedProducts = async (e) => {
  const { oldIndex, newIndex } = e.data;

  await featuredProductStore.updateFeaturedProducts(oldIndex, newIndex);
};
</script>

<template>
  <main class="mt-6 mx-4 p-4 sm:p-6 xl:p-8 bg-white shadow rounded-lg">
    <h1 class="text-2xl font-semibold mb-6">Administrar productos destacados</h1>

    <AdminSearchBar @add-product="addProduct" />

    <div id="draggable" class="grid grid-cols-[repeat(auto-fill,minmax(224px,288px))] gap-4">
      <article
        v-for="featuredProduct in featuredProductStore.featuredProducts"
        :key="featuredProduct.id"
        class="relative draggable-item border-solid flex-1 flex aspect-square text-gray-300 justify-center items-center cursor-default"
      >
        <ProductCard :product="featuredProduct.product" :cart-available="false" />
        <DeleteIcon
          class="cursor-pointer absolute top-2 right-2"
          @click="deleteFeaturedProductConfirmation(featuredProduct.id)"
        />
        <DraggableIcon class="handle w-6 aspect-square cursor-grab absolute top-2 left-2" />
      </article>
    </div>
  </main>
</template>
