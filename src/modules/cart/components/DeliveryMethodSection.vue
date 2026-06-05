<script setup lang="ts">
import { computed } from 'vue';
import { formatCurrency } from '@/helpers';
import { DeliveryCarrierType, type Delivery } from '../interfaces/delivery.interface';
import { useDeliveryStore } from '../stores/delivery';
import { useAddressStore } from '../stores/address';

const delivery = useDeliveryStore();
const address = useAddressStore();

const hasSelectedAddress = computed(() => Boolean(address.getSelectedAddress));

const getShippingPrice = (deliveryData: Delivery) => {
  return deliveryData.amount_shipping;
};

const isCarrierSelected = (deliveryId: number) => {
  return deliveryId === delivery.carrierSelected?.id;
};

const selectCarrier = (deliveryData: Delivery) => {
  delivery.setAmountShipping(getShippingPrice(deliveryData));
  delivery.setCarrierSelected(deliveryData);
};

const getCarrierEmoji = (deliveryData: Delivery) => {
  return deliveryData.carrier_type === DeliveryCarrierType.PICKUP ? '🏬' : '🚚';
};
</script>

<template>
  <section class="mt-6 shadow-md border border-shori-gray-6 p-4 rounded-lg">
    <h2 class="text-2xl font-bold border-b-2 border-shori-gray-6 pb-3 mb-6">Método de envío</h2>

    <ul
      v-if="delivery.deliveriesAvailable.length"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li
        v-for="deliveryData in delivery.deliveriesAvailable"
        :key="deliveryData.id"
        class="group relative flex min-h-[164px] cursor-pointer flex-col justify-between rounded-2xl border border-shori-gray-6 bg-shori-gray-1 p-4 shadow-sm transition-all duration-300 hover:border-shori-gray-8 hover:shadow-md"
        :class="
          isCarrierSelected(deliveryData.id)
            ? 'border-shori-gray-8 bg-shori-gray-2 ring-2 ring-shori-gray-7/35 shadow-md'
            : ''
        "
        @click="selectCarrier(deliveryData)"
      >
        <div class="mb-4 flex items-start justify-between">
          <div
            class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-shori-gray-2 to-shori-gray-4 text-shori-gray-11"
            :class="isCarrierSelected(deliveryData.id) ? 'text-shori-gray-12' : ''"
            aria-hidden="true"
          >
            <span class="text-2xl leading-none">{{ getCarrierEmoji(deliveryData) }}</span>
          </div>

          <span
            v-if="deliveryData.free_over"
            class="rounded-full bg-shori-green-3 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-shori-green-11"
          >
            Gratis
          </span>
        </div>

        <h3 class="text-base font-semibold tracking-tight text-shori-gray-12">
          {{ deliveryData.name }}
        </h3>

        <p class="mt-2 text-2xl font-bold text-shori-gray-12">
          {{ formatCurrency(getShippingPrice(deliveryData)) }}
        </p>
      </li>
    </ul>

    <div
      v-else
      class="rounded-2xl border border-dashed border-shori-gray-7 bg-shori-gray-2 p-6 text-center"
    >
      <div
        v-if="delivery.isLoading"
        class="flex flex-col items-center justify-center gap-3 text-shori-gray-11"
      >
        <span
          class="h-6 w-6 animate-spin rounded-full border-2 border-shori-gray-7 border-t-shori-gray-11"
          aria-hidden="true"
        />
        <p class="text-sm font-medium">Consultando métodos de envío...</p>
      </div>

      <p v-else-if="!hasSelectedAddress" class="text-sm font-medium text-shori-gray-11">
        Selecciona una dirección para ver los métodos de envío disponibles.
      </p>

      <p v-else class="text-sm font-medium text-shori-gray-11">
        No hay métodos de envío disponibles para la dirección seleccionada.
      </p>
    </div>
  </section>
</template>
