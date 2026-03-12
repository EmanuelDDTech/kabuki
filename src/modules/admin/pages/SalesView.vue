<script lang="ts" setup>
import { useSaleStore } from '@/modules/cart/stores/sale';
import { onMounted } from 'vue';
import PurchaseCard from '@/modules/cart/components/PurchaseCard.vue';

const saleStore = useSaleStore();

onMounted(async () => {
  await saleStore.getPurchasesAdmin();
});
</script>

<template>
  <main class="mt-6 mx-4 p-4 sm:p-6 xl:p-8 bg-shori-gray-1 shadow rounded-lg">
    <h1 class="text-2xl font-semibold mb-6">Ventas</h1>

    <div v-if="saleStore.isLoading" class="text-center">Cargando pedidos...</div>
    <div v-else>
      <div v-if="saleStore.isEmpty" class="text-shori-gray-11">No hay pedidos.</div>
      <div v-else class="grid gap-4">
        <PurchaseCard
          v-for="order in saleStore.getMyPurchases()"
          :key="order.id"
          :sale="order"
          :admin="true"
          :allInfo="true"
        />
      </div>
    </div>
  </main>
</template>
