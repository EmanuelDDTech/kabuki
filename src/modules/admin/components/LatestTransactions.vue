<script setup lang="ts">
import { formatCurrency } from '@/helpers';
import { converToDDMMYYYY } from '@/helpers/date';
import { useSaleStore } from '@/modules/cart/stores/sale';
import { onMounted } from 'vue';

const sales = useSaleStore();

onMounted(async () => {
  sales.getLatestPurchases({ limit: '7' });
});
</script>
<template>
  <div class="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Últimas Transacciones</h3>
        <!-- <span class="text-base font-normal text-gray-500"
          >This is a list of latest transactions</span
        > -->
      </div>
      <div class="flex-shrink-0">
        <router-link
          :to="{ name: 'sales' }"
          class="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2"
          >Ver todo</router-link
        >
      </div>
    </div>
    <div class="flex flex-col mt-8">
      <div class="overflow-x-auto rounded-lg">
        <div class="align-middle inline-block min-w-full">
          <div class="shadow overflow-hidden sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Transacción
                  </th>
                  <th
                    scope="col"
                    class="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha y Hora
                  </th>
                  <th
                    scope="col"
                    class="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cantidad
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-for="sale in sales.latestPurchasesList" :key="sale.id">
                  <td class="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
                    Pago de <span class="font-semibold">{{ sale.user?.name }}</span>
                  </td>
                  <td class="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                    {{ converToDDMMYYYY(sale.createdAt) }}
                  </td>
                  <td class="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
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
