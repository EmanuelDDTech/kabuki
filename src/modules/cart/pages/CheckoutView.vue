<script setup lang="ts">
import { computed, onMounted, shallowRef, watch } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import AddressSelectionSection from '../components/AddressSelectionSection.vue';
import DeliveryMethodSection from '../components/DeliveryMethodSection.vue';
import SideBard from '../components/SideBard.vue';
import { useAddressStore } from '../stores/address';
import { useCartStore } from '../stores/cart';
import { useDeliveryStore } from '../stores/delivery';
import { DeliveryCarrierType } from '../interfaces/delivery.interface';

const address = useAddressStore();
const cart = useCartStore();
const delivery = useDeliveryStore();
const router = useRouter();
// const fulfillmentMode = shallowRef<'delivery' | 'pickup'>('delivery');

// const isDeliveryMode = computed(() => fulfillmentMode.value === 'delivery');

// watch(
//   () => delivery.carrierSelected?.carrier_type,
//   (carrierType) => {
//     if (carrierType === DeliveryCarrierType.PICKUP) {
//       fulfillmentMode.value = 'pickup';
//       return;
//     }

//     if (carrierType === DeliveryCarrierType.DELIVERY) {
//       fulfillmentMode.value = 'delivery';
//     }
//   },
// );

onMounted(async () => {
  if (cart.isEmpty) {
    router.push({ name: 'cart' });
    return;
  }

  await address.getAddresses();
});

onBeforeRouteLeave((to) => {
  if (to.name !== 'pay') {
    address.clearSelectedAddress();
    delivery.clearSelectedAddress();
  }
});
</script>

<template>
  <main class="checkout-page min-h-screen px-3 pb-10 pt-6">
    <div class="max-w-screen-xl mx-auto block lg:flex gap-8 xl:gap-10 mt-4">
      <div class="flex-1 min-w-0 space-y-6">
        <section class="checkout-surface p-6 md:p-7">
          <header
            class="border-b pb-[0.95rem] [border-color:color-mix(in_srgb,var(--gray-6)_78%,transparent)]"
          >
            <p class="text-[0.72rem] uppercase tracking-[0.1em] text-shori-gray-10 font-bold">
              Paso 1
            </p>
            <h2 class="mt-[0.35rem] text-[clamp(1.4rem,2.4vw,2rem)] font-bold text-shori-gray-12">
              Método de entrega
            </h2>
            <p class="mt-2 text-[0.95rem] text-shori-gray-10">
              Elige cómo deseas recibir tu pedido.
            </p>
          </header>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 mt-6">
            <button
              type="button"
              class="border rounded-[20px] p-4 flex items-start gap-3 text-left transition-all duration-200 hover:-translate-y-px [border-color:color-mix(in_srgb,var(--gray-6)_78%,transparent)] [background-color:color-mix(in_srgb,var(--gray-1)_85%,var(--gray-2))]"
              :class="
                delivery.isDeliveryTypeDelivery
                  ? 'border-shori-green-8 [box-shadow:0_12px_24px_color-mix(in_srgb,var(--green-9)_30%,transparent)]'
                  : ''
              "
              @click="delivery.setDeliveryType(DeliveryCarrierType.DELIVERY)"
            >
              <span
                class="w-11 h-11 rounded-xl inline-flex items-center justify-center text-[1.35rem] [background-color:color-mix(in_srgb,var(--gray-2)_84%,var(--gray-1))]"
                >🚚</span
              >
              <span class="flex flex-col gap-1.5">
                <strong class="text-[1.03rem] text-shori-gray-12">Envío a domicilio</strong>
                <small class="text-shori-gray-10 leading-[1.3]"
                  >Selecciona una dirección guardada o agrega una nueva.</small
                >
              </span>
            </button>

            <button
              type="button"
              class="border rounded-[20px] p-4 flex items-start gap-3 text-left transition-all duration-200 hover:-translate-y-px [border-color:color-mix(in_srgb,var(--gray-6)_78%,transparent)] [background-color:color-mix(in_srgb,var(--gray-1)_85%,var(--gray-2))]"
              :class="
                delivery.isDeliveryTypePickup
                  ? 'border-shori-green-8 [box-shadow:0_12px_24px_color-mix(in_srgb,var(--green-9)_30%,transparent)]'
                  : ''
              "
              @click="delivery.setDeliveryType(DeliveryCarrierType.PICKUP)"
            >
              <span
                class="w-11 h-11 rounded-xl inline-flex items-center justify-center text-[1.35rem] [background-color:color-mix(in_srgb,var(--gray-2)_84%,var(--gray-1))]"
                >🏬</span
              >
              <span class="flex flex-col gap-1.5">
                <strong class="text-[1.03rem] text-shori-gray-12">Recoger en sucursal</strong>
                <small class="text-shori-gray-10 leading-[1.3]"
                  >Verás las opciones de sucursal disponibles en el siguiente bloque.</small
                >
              </span>
            </button>
          </div>
        </section>

        <AddressSelectionSection v-if="delivery.isDeliveryTypeDelivery" />

        <section v-else class="checkout-surface p-6">
          <h3 class="text-xl font-bold text-shori-gray-12">Dirección de entrega</h3>
          <p class="mt-3 text-sm text-shori-gray-10">
            Elegiste recoger en sucursal. No necesitas seleccionar dirección en este paso.
          </p>
        </section>

        <DeliveryMethodSection />

        <section class="checkout-surface p-6 md:p-7">
          <header
            class="border-b pb-[0.95rem] [border-color:color-mix(in_srgb,var(--gray-6)_78%,transparent)]"
          >
            <p class="text-[0.72rem] uppercase tracking-[0.1em] text-shori-gray-10 font-bold">
              Paso 3
            </p>
            <h2 class="mt-[0.35rem] text-[clamp(1.4rem,2.4vw,2rem)] font-bold text-shori-gray-12">
              Pago
            </h2>
            <p class="mt-2 text-[0.95rem] text-shori-gray-10">
              Cuando selecciones método de entrega y opción disponible, podrás continuar a pago.
            </p>
          </header>
        </section>
      </div>

      <SideBard checkout-step="delivery" />
    </div>
  </main>
</template>

<style scoped>
/* .checkout-page {
  background:
    radial-gradient(circle at 12% 12%, color-mix(in srgb, var(--green-3) 58%, transparent), transparent 34%),
    radial-gradient(circle at 85% 10%, color-mix(in srgb, var(--gray-3) 75%, transparent), transparent 35%),
    var(--color-background);
} */

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
