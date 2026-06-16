<script setup lang="ts">
import BarTable from '@/modules/dashboard/components/BarTable.vue';
import LatestCustomers from '../components/LatestCustomers.vue';
import LatestTransactions from '../components/LatestTransactions.vue';
import { formatCurrency } from '@/helpers';
import { useSaleStore } from '@/modules/cart/stores/sale';
import { useSaleSummaryStore } from '@/modules/sale/stores/saleSummary';
import OptionsButtons from '@/modules/common/components/OptionsButtons.vue';
import { onMounted } from 'vue';
import { useUsersStore } from '@/modules/user/stores/users';

const sales = useSaleStore();
const users = useUsersStore();
const salesSummary = useSaleSummaryStore();

const metrics = [
  {
    title: 'Nuevos productos',
    value: '2,340',
    trend: '+14.6%',
    positive: true,
  },
  {
    title: 'Visitantes esta semana',
    value: '5,355',
    trend: '+32.9%',
    positive: true,
  },
  {
    title: 'Registros de usuarios',
    value: '385',
    trend: '-2.7%',
    positive: false,
  },
];

onMounted(async () => {
  try {
    await Promise.allSettled([
      sales.getLatestPurchases({ limit: '7' }),
      users.getLatestUsers({ limit: '5' }),
      salesSummary.getSalesSummary(salesSummary.selectedOption),
    ]);
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <main class="mx-2 sm:mx-4">
    <div class="relative overflow-hidden rounded-2xl">
      <div class="relative space-y-8 px-8 pb-6 pt-4 sm:space-y-8 sm:px-8 sm:py-8">
        <section class="grid grid-cols-1 gap-8 xl:grid-cols-2 2xl:grid-cols-3">
          <div
            class="2xl:col-span-2 rounded-2xl bg-shori-gray-2 p-4 transition-all duration-300 ease-out hover:border-shori-gray-6 sm:p-6 xl:p-8"
          >
            <div class="mb-5 flex flex-wrap items-start justify-between gap-3 sm:mb-6">
              <div class="min-w-0">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-shori-gray-10">
                  Rendimiento de ventas
                </p>
                <span
                  class="mt-1 block text-[clamp(1.6rem,2.8vw,2.3rem)] font-bold leading-none text-shori-gray-12"
                >
                  {{ formatCurrency(salesSummary.saleSummaryTotal) }}
                </span>
                <p class="mt-2 text-sm text-shori-gray-10">Resumen por periodo seleccionado</p>
              </div>
            </div>

            <div class="rounded-xl bg-shori-gray-2 p-2 sm:p-3">
              <OptionsButtons
                :options="salesSummary.periodOptions"
                :selected-option="salesSummary.selectedOption"
                @select-option="salesSummary.selectPeriod"
              />
            </div>

            <div class="mt-4 sm:mt-5">
              <BarTable
                :title="`Ventas (${salesSummary.selectedOption})`"
                :labels="salesSummary.saleSummaryLabels"
                :values="salesSummary.saleSummaryValues"
              />
            </div>
          </div>

          <div class="rounded-2xl transition-all duration-300 ease-out hover:-translate-y-0.5">
            <LatestTransactions :sales="sales.latestPurchasesList" />
          </div>
        </section>

        <section class="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          <article
            v-for="metric in metrics"
            :key="metric.title"
            class="rounded-2xl bg-shori-gray-2 p-4 transition-all duration-300 ease-out hover:border-shori-gray-6 sm:p-5"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-medium text-shori-gray-10">{{ metric.title }}</p>
                <p class="mt-2 text-2xl font-bold leading-none text-shori-gray-12 sm:text-3xl">
                  {{ metric.value }}
                </p>
              </div>

              <div
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold"
                :class="
                  metric.positive
                    ? 'border border-shori-green-7 bg-shori-gray-2 text-shori-green-11'
                    : 'border border-shori-gray-7 bg-shori-gray-2 text-shori-gray-11'
                "
              >
                <svg
                  v-if="metric.positive"
                  class="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span>{{ metric.trend }}</span>
              </div>
            </div>
          </article>
        </section>

        <section class="rounded-2xl transition-all duration-300 ease-out hover:shadow-md">
          <LatestCustomers :users="users.latestUsersList" />
        </section>
      </div>
    </div>
  </main>
</template>
