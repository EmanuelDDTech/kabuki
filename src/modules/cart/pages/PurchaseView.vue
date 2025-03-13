<script lang="ts" setup>
import { onMounted } from 'vue';
import { useSaleStore } from '../stores/sale';
import { useRoute } from 'vue-router';
import { formatCurrency } from '@/helpers';

const saleStore = useSaleStore();
const route = useRoute();

onMounted(async () => {
  const { saleId } = route.params;
  await saleStore.getPurchaseById(parseInt(saleId));
});
</script>

<template>
  <div class="max-w-screen-xl mx-auto my-10">
    <div class="mx-4 p-10 border border-slate-200 rounded-lg">
      <p class="text-lg text-slate-700">Gracias!</p>
      <h1 class="text-3xl font-bold my-2">Detalles del pedido 🚀</h1>
      <p class="text-lg text-slate-700 mb-5">
        Tu pedido está en camino. Te informaremos sobre las actualizaciones.
      </p>
      <div
        class="h-[4px] rounded-full bg-gradient-to-r from-green-500 from-30% to-transparent to-60%"
      ></div>

      <div class="py-7">
        <div class="text-lg text-slate-900">
          <span class="mr-2">Número de pedido:</span
          ><span class="text-green-600">{{ saleStore.purchaseInfo?.id }}</span>
        </div>
      </div>

      <ul class="border border-slate-200 rounded-md divide-y">
        <li
          v-for="sale_cart in saleStore.purchaseInfo?.sale_carts"
          :key="sale_cart.id"
          class="flex flex-col sm:flex-row gap-2 items-center p-4"
        >
          <img
            :src="sale_cart.product.product_galleries[0].url"
            :alt="`Imagen ${sale_cart.product.name}`"
            class="w-28"
          />
          <div class="flex flex-col flex-1">
            <span class="font-semibold text-slate-900 mb-3">{{ sale_cart.product.name }}</span>
            <span class="text-sm text-slate-700">Cantidad: {{ sale_cart.quantity }}</span>
          </div>
          <span class="text-slate-900">{{ formatCurrency(sale_cart.price_unit) }}</span>
        </li>
      </ul>

      <div class="mt-8 px-4">
        <h3 class="text-lg text-slate-900">Dirección de entrega</h3>
        <div class="text-sm text-slate-700 mt-3 mb-6">
          <p class="mb-1">
            {{
              `${saleStore.purchaseInfo?.address.street}, ${saleStore.purchaseInfo?.address.colony}, ${saleStore.purchaseInfo?.address.city}, ${saleStore.purchaseInfo?.address.state}, ${saleStore.purchaseInfo?.address.country}.`
            }}
          </p>
          <p>{{ saleStore.purchaseInfo?.address.phone }}</p>
        </div>

        <h3 class="text-lg text-slate-900">Resumen</h3>
        <div class="text-sm text-slate-700 mt-3 mb-6">
          <div class="flex justify-between mb-3">
            <span>Subtotal</span
            ><span class="text-base text-slate-900 font-semibold">{{
              formatCurrency(
                saleStore.purchaseInfo?.amount_total - saleStore.purchaseInfo?.amount_shipping,
              )
            }}</span>
          </div>
          <div class="flex justify-between mb-3">
            <span>Envío</span>
            <span class="text-base text-slate-900 font-semibold">{{
              formatCurrency(saleStore.purchaseInfo?.amount_shipping)
            }}</span>
          </div>

          <div class="flex justify-between py-3 border-t border-slate-200">
            <span class="text-base">Total</span>
            <span class="text-lg text-slate-900 font-semibold">{{
              formatCurrency(saleStore.purchaseInfo?.amount_total)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
