<script setup lang="ts">
import { formatCurrency } from '@/helpers';
import type { Delivery } from '../interfaces/delivery.interface';
import { useDeliveryStore } from '../stores/delivery';

const delivery = useDeliveryStore();

const selectCarrier = (deliveryData: Delivery) => {
  delivery.setAmountShipping(
    deliveryData.free_over ? 0 : deliveryData.delivery_price_rules[0].list_base_price,
  );
  delivery.setCarrierSelected(deliveryData);
};
</script>

<template>
  <section class="mt-6 shadow-md border border-shori-gray-6 p-4 rounded-lg">
    <h2 class="text-2xl font-bold border-b-2 border-shori-gray-6 pb-3 mb-6">Método de envío</h2>

    <ul class="flex flex-wrap justify-around gap-6">
      <li
        v-for="deliveryData in delivery.deliveriesAvailable"
        :key="deliveryData.id"
        class="flex flex-col flex-1 min-h-full max-w-56 min-w-[130px] items-center cursor-pointer p-2 rounded-md border hover:border-shori-gray-6 transition-colors hover:shadow hover:bg-shori-gray-2"
        :class="
          deliveryData.id === delivery.carrierSelected?.id
            ? 'border-blue-600 shadow shadow-blue-600'
            : 'border-transparent'
        "
        @click="selectCarrier(deliveryData)"
      >
        <div class="flex-1 flex items-center">
          <img :src="deliveryData.image" :alt="`Logo ${deliveryData.name}`" class="w-40" />
        </div>

        <h3 v-if="deliveryData.free_over" class="mt-2 text-center">
          {{ deliveryData.name }}
        </h3>

        <h3 class="font-bold text-lg">
          {{
            formatCurrency(
              deliveryData.free_over ? 0 : deliveryData.delivery_price_rules[0].list_base_price,
            )
          }}
        </h3>
      </li>
    </ul>
  </section>
</template>
