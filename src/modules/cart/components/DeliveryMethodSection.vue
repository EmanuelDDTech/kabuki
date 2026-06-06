<script setup lang="ts">
import { computed } from 'vue';
import { formatCurrency } from '@/helpers';
import { DeliveryCarrierType, type Delivery } from '../interfaces/delivery.interface';
import { useDeliveryStore } from '../stores/delivery';
import { useAddressStore } from '../stores/address';

const delivery = useDeliveryStore();
const address = useAddressStore();

const hasSelectedAddress = computed(() => Boolean(address.getSelectedAddress));
const selectedCarrierType = computed(() => delivery.carrierSelected?.carrier_type);

const deliveryMethodsCount = computed(
  () =>
    delivery.deliveriesAvailable.filter(
      (deliveryData) => deliveryData.carrier_type === DeliveryCarrierType.DELIVERY,
    ).length,
);

const pickupMethodsCount = computed(
  () =>
    delivery.deliveriesAvailable.filter(
      (deliveryData) => deliveryData.carrier_type === DeliveryCarrierType.PICKUP,
    ).length,
);

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
  <section class="checkout-surface p-6 md:p-7">
    <header class="border-b border-[color-mix(in_srgb,var(--gray-6)_78%,transparent)] pb-[0.95rem]">
      <p class="text-[0.72rem] uppercase tracking-[0.1em] text-shori-gray-10 font-bold">Paso 2</p>
      <h2 class="mt-[0.35rem] text-[clamp(1.35rem,2.2vw,1.9rem)] font-bold text-shori-gray-12">
        Opciones de envío / entrega
      </h2>
      <p class="mt-2 text-[0.94rem] text-shori-gray-10">
        Opciones traídas desde la API con base en tu carrito y selección.
      </p>
    </header>

    <!-- <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div
        class="rounded-[18px] border border-[color-mix(in_srgb,var(--gray-6)_80%,transparent)] bg-[color-mix(in_srgb,var(--gray-1)_84%,var(--gray-2))] p-[0.9rem] flex items-center gap-[0.7rem]"
        :class="
          selectedCarrierType === DeliveryCarrierType.DELIVERY
            ? 'border-shori-green-8 shadow-[0_10px_20px_color-mix(in_srgb,var(--green-9)_30%,transparent)]'
            : ''
        "
      >
        <div
          class="w-10 h-10 rounded-[11px] inline-flex items-center justify-center bg-[color-mix(in_srgb,var(--gray-2)_84%,var(--gray-1))]"
        >
          🚚
        </div>
        <div>
          <p class="text-base font-bold text-shori-gray-12">Envío a domicilio</p>
          <p class="mt-1 text-[0.84rem] text-shori-gray-10">
            {{ deliveryMethodsCount }} opciones disponibles
          </p>
        </div>
      </div>

      <div
        class="rounded-[18px] border border-[color-mix(in_srgb,var(--gray-6)_80%,transparent)] bg-[color-mix(in_srgb,var(--gray-1)_84%,var(--gray-2))] p-[0.9rem] flex items-center gap-[0.7rem]"
        :class="
          selectedCarrierType === DeliveryCarrierType.PICKUP
            ? 'border-shori-green-8 shadow-[0_10px_20px_color-mix(in_srgb,var(--green-9)_30%,transparent)]'
            : ''
        "
      >
        <div
          class="w-10 h-10 rounded-[11px] inline-flex items-center justify-center bg-[color-mix(in_srgb,var(--gray-2)_84%,var(--gray-1))]"
        >
          🏬
        </div>
        <div>
          <p class="text-base font-bold text-shori-gray-12">Recoger en sucursal</p>
          <p class="mt-1 text-[0.84rem] text-shori-gray-10">
            {{ pickupMethodsCount }} opciones disponibles
          </p>
        </div>
      </div>
    </div> -->

    <h3 class="mt-5 mb-3 text-shori-gray-11 text-[0.88rem] font-bold tracking-[0.08em] uppercase">
      Opciones disponibles
    </h3>

    <ul
      v-if="delivery.deliveriesAvailable.length"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <li
        v-for="deliveryData in delivery.deliveriesAvailable"
        :key="deliveryData.id"
        class="group relative flex min-h-[172px] cursor-pointer flex-col justify-between rounded-2xl border border-shori-gray-6 bg-gradient-to-b from-shori-gray-1 to-shori-gray-2 p-4 shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:border-shori-green-8 hover:shadow-md"
        :class="
          isCarrierSelected(deliveryData.id)
            ? 'border-shori-green-8 bg-shori-gray-1 ring-2 ring-shori-green-8/25 shadow-md'
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

          <div class="flex items-center gap-2">
            <span
              class="rounded-full bg-[color-mix(in_srgb,var(--gray-2)_78%,var(--gray-1))] text-shori-gray-10 text-[0.68rem] px-[0.55rem] py-[0.2rem] tracking-[0.06em] uppercase font-bold"
            >
              {{
                deliveryData.carrier_type === DeliveryCarrierType.PICKUP ? 'Sucursal' : 'Domicilio'
              }}
            </span>

            <span
              v-if="deliveryData.free_over"
              class="rounded-full bg-shori-green-3 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-shori-green-11"
            >
              Gratis
            </span>
          </div>
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

<style scoped>
.checkout-surface {
  border-radius: 30px;
  border: 1px solid color-mix(in srgb, var(--gray-6) 80%, transparent);
  background: linear-gradient(
    156deg,
    color-mix(in srgb, var(--gray-1) 92%, var(--gray-2)),
    color-mix(in srgb, var(--gray-1) 84%, var(--gray-2))
  );
  box-shadow:
    0 24px 56px rgba(17, 33, 61, 0.08),
    0 10px 22px rgba(17, 33, 61, 0.04);
}
</style>
