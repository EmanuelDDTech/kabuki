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
  <div class="bg-shori-gray-1 shadow rounded-lg p-4 sm:p-6 xl:p-8">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h3 class="text-xl font-bold text-shori-gray-12 mb-2">Últimas Transacciones</h3>
        <!-- <span class="text-base font-normal text-gray-500"
          >This is a list of latest transactions</span
        > -->
      </div>
      <div class="flex-shrink-0">
        <router-link
          :to="{ name: 'sales' }"
          class="text-sm font-medium text-cyan-600 hover:bg-shori-gray-3 rounded-lg p-2"
          >Ver todo</router-link
        >
      </div>
    </div>
    <div class="flex flex-col mt-8">
      <div
        class="overflow-x-auto scrollbar-thin scrollbar-track-shori-gray-6 scrollbar-thumb-shori-gray-3 rounded-lg"
      >
        <div class="align-middle inline-block min-w-full">
          <div class="shadow overflow-hidden sm:rounded-lg">
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
              <tbody class="bg-shori-gray-2">
                <tr v-for="sale in sales" :key="sale.id">
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
