<script lang="ts" setup>
import { inject } from 'vue';
import EditIcon from '@/modules/admin/components/icons/EditIcon.vue';
import Swal from 'sweetalert2';
import { useCategoryStore } from '../stores/category';
import CategoryAPI from '../api/CategoryAPI';
import DeleteIcon from '@/modules/common/icons/DeleteIcon.vue';

const categoryStore = useCategoryStore();

const toast = inject('toast');

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

const deleteProduct = async (id) => {
  try {
    const { data } = await CategoryAPI.delete(id);
    toast.open({
      message: data.msg,
      type: 'success',
    });
    categoryStore.categories = categoryStore.categories.filter((category) => category.id !== id);
  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};
</script>

<template>
  <main class="mt-6 mx-4 p-4 sm:p-6 xl:p-8 bg-white shadow rounded-lg">
    <h1 class="text-2xl font-semibold mb-6">Administrar categorías</h1>

    <section class="flex h-full flex-col justify-center">
      <div class="mx-auto w-full rounded-sm flex flex-col">
        <RouterLink
          :to="{ name: 'adminCreateCategory' }"
          class="mb-6 w-36 self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm text-center p-2"
        >
          Crear Categoría
        </RouterLink>

        <div class="overflow-x-auto">
          <table class="w-full table-auto">
            <thead class="shadow bg-gray-50 text-xs font-semibold uppercase text-gray-400">
              <tr>
                <th class="p-2">
                  <div class="text-left font-semibold">Nombre</div>
                </th>
                <th class="p-2">
                  <div class="text-left font-semibold">Filtros</div>
                </th>
                <th class="p-2">
                  <div class="text-center font-semibold">Acciones</div>
                </th>
              </tr>
            </thead>

            <tbody
              class="divide-y divide-gray-100 text-sm shadow"
              v-for="category in categoryStore.categories"
              :key="category.id"
            >
              <tr>
                <td class="p-2">
                  <div class="font-medium text-gray-800">{{ category.name }}</div>
                </td>
                <td class="p-2">
                  <div class="flex gap-1 text-left font-medium text-gray-800">
                    <div
                      v-for="filterGroup in category.filter_categories"
                      :key="filterGroup.id"
                      class="bg-blue-100 inline-block py-1 px-2 rounded-lg"
                    >
                      {{ filterGroup.filter_group.name }}
                    </div>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex justify-center">
                    <button @click="deleteConfirmation(category.id)">
                      <delete-icon />
                    </button>

                    <RouterLink :to="{ name: 'adminUpdateCategory', params: { id: category.id } }">
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
