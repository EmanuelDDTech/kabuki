<script setup lang="ts">
import { formatCurrency } from '@/helpers';
import { converToDDMMYYYY } from '@/helpers/date';
import type { Sale } from '@/modules/cart/interfaces/sale.interface';

interface Props {
  sales: Sale[];
}

defineProps<Props>();
</script>
<template>
  <div class="rounded-2xl bg-shori-gray-2 p-4 transition-all duration-300 ease-out sm:p-6 xl:p-8">
    <div class="mb-4 flex items-center justify-between gap-3">
      <div>
        <h3 class="text-xl font-bold text-shori-gray-12 mb-2">Últimas Transacciones</h3>
        <!-- <span class="text-base font-normal text-gray-500"
          >This is a list of latest transactions</span
        > -->
      </div>
      <div class="flex-shrink-0">
        <router-link
          :to="{ name: 'sales' }"
          class="inline-flex items-center rounded-lg border border-shori-gray-6 bg-shori-gray-2 px-2 py-1.5 text-sm font-medium text-shori-green-11 transition-colors duration-200 hover:border-shori-green-7 hover:bg-shori-gray-2 hover:text-shori-green-12"
          >Ver todo</router-link
        >
      </div>
    </div>
    <div class="mt-6 flex flex-col">
      <div
        class="overflow-x-auto rounded-xl scrollbar-thin scrollbar-track-shori-gray-6 scrollbar-thumb-shori-gray-4"
      >
        <div class="align-middle inline-block min-w-full">
          <div class="overflow-hidden sm:rounded-lg">
            <table class="min-w-full divide-y divide-shori-gray-6">
              <thead class="bg-shori-gray-2">
                <tr class="text-shori-gray-11">
                  <th
                    scope="col"
                    class="p-4 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Transacción
                  </th>
                  <th
                    scope="col"
                    class="p-4 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Fecha y Hora
                  </th>
                  <th
                    scope="col"
                    class="p-4 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Cantidad
                  </th>
                </tr>
              </thead>
              <tbody class="bg-shori-gray-2/55">
                <tr
                  v-for="sale in sales"
                  :key="sale.id"
                  class="transition-colors duration-200 hover:bg-shori-gray-3/55"
                >
                  <td class="p-4 whitespace-nowrap text-sm font-normal text-shori-gray-12">
                    Pago de <span class="font-semibold">{{ sale.user?.name }}</span>
                  </td>
                  <td class="p-4 whitespace-nowrap text-sm font-normal text-shori-gray-11">
                    {{ converToDDMMYYYY(sale.createdAt) }}
                  </td>
                  <td class="p-4 whitespace-nowrap text-sm font-semibold text-shori-gray-12">
                    {{ formatCurrency(sale.amount_total) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
