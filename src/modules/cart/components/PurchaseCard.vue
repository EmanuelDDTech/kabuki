<script lang="ts" setup>
import { formatCurrency } from '@/helpers';
import { State, type Sale } from '../interfaces/sale.interface';
import { converToDDMMYYYY } from '@/helpers/date';
import { useSaleStore } from '../stores/sale';

const saleStore = useSaleStore();

interface Props {
  sale: Sale;
  admin?: Boolean;
}

defineProps<Props>();
</script>

<template>
  <article class="rounded-lg border bg-card text-card-foreground shadow-sm">
    <div class="flex flex-col sm:flex-row gap-3 p-6">
      <div class="min-w-20 w-20 flex items-center">
        <img
          :src="sale.sale_carts[0].product.product_galleries[0].url"
          alt="Imagenes de productos del pedido"
        />
      </div>
      <div class="flex flex-1 flex-col space-y-1.5">
        <div class="flex flex-col sm:flex-row justify-between items-start gap-3">
          <h3 class="text-xl font-semibold leading-none tracking-tight line-clamp-2">
            {{ saleStore.namesCombined(sale) }}
          </h3>

          <div
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 capitalize"
            :class="{
              'bg-green-500 border-green-500': sale.state === State.COMPLETED,
              'bg-yellow-500 border-yellow-500': sale.state === State.PENDING,
              'bg-red-500 border-red-500': sale.state === State.CANCELED,
            }"
          >
            {{ sale.state }}
          </div>
        </div>
        <p class="text-sm text-muted-foreground">
          Pedido <span class="font-bold"># {{ sale.id }}</span> • realizado el
          <span class="font-bold">{{ converToDDMMYYYY(sale.createdAt) }}</span>
        </p>

        <div class="pt-0">
          <div class="flex justify-between items-center">
            <div class="font-medium">{{ formatCurrency(sale.amount_total) }}</div>
            <router-link
              :to="{ name: admin ? 'adminSaleInfo' : 'purchaseInfo', params: { saleId: sale.id } }"
              class="text-blue-500"
              >Ver detalles del pedido</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
