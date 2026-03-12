<script lang="ts" setup>
import { onMounted } from 'vue';
import { useSaleStore } from '../stores/sale';
import PurchaseCard from '../components/PurchaseCard.vue';

const sale = useSaleStore();

onMounted(async () => {
  await sale.getPurchases();
});
</script>

<template>
  <div class="w-full">
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Mis Compras</h1>

      <div v-if="sale.isLoading" class="text-center">Cargando pedidos...</div>
      <div v-else>
        <div v-if="sale.isEmpty" class="text-shori-gray-11">No tienes pedidos realizados.</div>
        <div v-else class="grid gap-4">
          <PurchaseCard v-for="order in sale.getMyPurchases()" :key="order.id" :sale="order" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
}
</style>
