<script lang="ts" setup>
import Swal from 'sweetalert2';
import { onMounted } from 'vue';
import { useDiscountCodeStore } from '../stores/discountCode';
import { DiscountType } from '../interfaces/discountCode.interface';
import { formatCurrency } from '@/helpers';
import { converToDDMMYYYY } from '@/helpers/date';
import EditIcon from '@/modules/common/icons/EditIcon.vue';

const discountCodeStore = useDiscountCodeStore();

onMounted(() => {
  discountCodeStore.getDiscountCodesAll();
});

const deleteConfirmation = (id: number) => {
  Swal.fire({
    title: 'Seguro quieres eliminar esta campaña?',
    text: 'No podrá ser revertido!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Eliminar!',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    // if (result.isConfirmed) {
    //   try {
    //     await campaign.deleteCampaign(id);
    //     toast.open({
    //       message: 'Campaña eliminada correctamente',
    //       type: 'success',
    //     });
    //   } catch (error) {
    //     toast.open({
    //       message: error.response.data.msg,
    //       type: 'error',
    //     });
    //   }
    // }
  });
};
</script>

<template>
  <main class="mt-6 mx-4 p-4 sm:p-6 xl:p-8 bg-white shadow rounded-lg">
    <h1 class="text-2xl font-semibold mb-6">Códigos de Descuento</h1>

    <section class="flex h-full flex-col justify-center">
      <div class="mx-auto w-full rounded-sm flex flex-col">
        <RouterLink
          :to="{ name: 'adminCreateCampaign' }"
          class="mb-6 w-36 self-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm text-center p-2"
        >
          Crear Campaña
        </RouterLink>

        <div class="overflow-x-auto">
          <table class="w-full table-auto">
            <thead class="shadow bg-gray-50 text-xs font-semibold uppercase text-gray-400">
              <tr>
                <th class="p-2">
                  <div class="text-left font-semibold">Código</div>
                </th>
                <th class="p-2">
                  <div class="text-left font-semibold">Tipo de descuento</div>
                </th>
                <th class="p-2">
                  <div class="text-left font-semibold">Valor de descuento</div>
                </th>
                <th class="p-2">
                  <div class="text-left font-semibold">Compra mínima</div>
                </th>
                <th class="p-2">
                  <div class="text-center font-semibold">Descuento máximo</div>
                </th>
                <th class="p-2">
                  <div class="text-center font-semibold">Límite de usos</div>
                </th>
                <th class="p-2">
                  <div class="text-center font-semibold">Veces usado</div>
                </th>
                <th class="p-2">
                  <div class="text-center font-semibold">Expiración</div>
                </th>
                <th class="p-2">
                  <div class="text-center font-semibold">Acciones</div>
                </th>
              </tr>
            </thead>

            <tbody
              class="divide-y divide-gray-100 text-sm shadow"
              v-for="discountCode in discountCodeStore.discountCodes"
              :key="discountCode.id"
            >
              <tr>
                <td class="p-2">
                  <div class="text-base font-medium text-gray-800">{{ discountCode.code }}</div>
                </td>
                <td class="p-2">
                  <div class="text-base text-left">{{ discountCode.discount_type }}</div>
                </td>
                <td class="p-2">
                  <div class="text-base text-left">
                    {{
                      discountCode.discount_type === DiscountType.FIXED
                        ? formatCurrency(discountCode.discount_value)
                        : `${discountCode.discount_value} %`
                    }}
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-base text-left">
                    {{ formatCurrency(discountCode.min_purchase) }}
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-base text-left">
                    {{ formatCurrency(discountCode.max_discount) }}
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-base text-left">
                    {{ discountCode.usage_limit }}
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-base text-left">
                    {{ discountCode.times_used }}
                  </div>
                </td>
                <td class="p-2">
                  <div class="text-base text-left font-medium text-gray-800">
                    {{ converToDDMMYYYY(discountCode.expires_at) }}
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex justify-center">
                    <button @click="deleteConfirmation(discountCode.id ?? 0)">
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

                    <RouterLink
                      :to="{ name: 'adminUpdateCampaign', params: { id: discountCode.id ?? 0 } }"
                    >
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
