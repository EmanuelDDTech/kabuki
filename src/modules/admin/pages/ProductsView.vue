<script lang="ts" setup>
import { inject, onMounted } from 'vue';
import { useProductsStore } from '@/modules/products/stores/products';
import { formatCurrency } from '@/helpers';
import EditIcon from '@/modules/admin/components/icons/EditIcon.vue';
import Swal from 'sweetalert2';
import ProductAPI from '@/modules/product/api/ProductAPI';
import useImage from '@/modules/products/composables/useImage';

const productStore = useProductsStore();
const toast: any = inject('toast');

const { deleteByProductId } = useImage();

const deleteConfirmation = (id) => {
  Swal.fire({
    title: 'Seguro quieres eliminar este producto?',
    text: 'No podrá ser revertido!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Eliminar!',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      deleteProduct(id);
    }
  });
};

const deleteProduct = async (id: any) => {
  try {
    await deleteByProductId(id);
    const { data } = await ProductAPI.delete(id);
    toast.open({
      message: 'Producto eliminado correctamente',
      type: 'success',
    });
    productStore.getProducts();
  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};

onMounted(async () => {
  await productStore.getProducts();
});
</script>

<template>
  <main class="mt-6 mx-4 p-4 sm:p-6 xl:p-8 bg-white shadow rounded-lg">
    <h1 class="text-2xl font-semibold mb-6">Administrar productos</h1>

    <section class="flex h-full flex-col justify-center">
      <div class="mx-auto w-full rounded-sm flex flex-col">
        <RouterLink
          :to="{ name: 'adminCreateProduct' }"
          class="mb-6 w-36 self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm text-center p-2"
        >
          Crear Producto
        </RouterLink>

        <div class="overflow-x-auto">
          <table class="w-full table-auto">
            <thead class="shadow bg-gray-50 text-xs font-semibold uppercase text-gray-400">
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
                <th class="p-2">
                  <div class="text-left font-semibold">Costo</div>
                </th>
                <th class="p-2">
                  <div class="text-left font-semibold">Precio</div>
                </th>
                <th class="p-2">
                  <div class="text-center font-semibold">Action</div>
                </th>
              </tr>
            </thead>

            <tbody
              class="divide-y divide-gray-100 text-sm shadow"
              v-for="product in productStore.products"
              :key="product.id"
            >
              <tr>
                <td class="p-2">
                  <img class="w-32" :src="product.product_galleries[0].url" alt="product image" />
                </td>
                <td class="p-2">
                  <div class="text-base font-medium text-gray-800">{{ product.name }}</div>
                </td>
                <td class="p-2">
                  <div class="text-base text-left">{{ product.stock }}</div>
                </td>
                <td class="p-2">
                  <div class="text-base text-left font-medium text-red-500">
                    {{ formatCurrency(0) }}
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-base text-left font-medium text-green-500">
                    {{ formatCurrency(product.price) }}
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex justify-center">
                    <button @click="deleteConfirmation(product.id)">
                      <svg
                        class="h-8 w-8 rounded-full p-1 hover:bg-gray-100 hover:text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>

                    <RouterLink :to="{ name: 'adminUpdateProducts', params: { id: product.id } }">
                      <EditIcon
                        class="h-8 w-8 p-1 rounded-full hover:bg-gray-100 hover:text-blue-600"
                      />
                    </RouterLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>
