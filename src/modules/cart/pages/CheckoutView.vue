<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import AddressSelectionSection from '../components/AddressSelectionSection.vue';
import DeliveryMethodSection from '../components/DeliveryMethodSection.vue';
import SideBard from '../components/SideBard.vue';
import { useAddressStore } from '../stores/address';
import { type CheckoutPaymentMethod, useCartStore } from '../stores/cart';
import { useDeliveryStore } from '../stores/delivery';
import { DeliveryCarrierType } from '../interfaces/delivery.interface';
import { useDiscountCodeStore } from '@/modules/discountCode/stores/discountCode';

const address = useAddressStore();
const cart = useCartStore();
const delivery = useDeliveryStore();
const discountCodeStore = useDiscountCodeStore();
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

watch(
  () => discountCodeStore.isDiscountCodeSelected,
  (isDiscountSelected) => {
    if (isDiscountSelected && cart.selectedPaymentMethod === 'paypal') {
      cart.setSelectedPaymentMethod('transferencia');
    }
  },
  { immediate: true },
);

const selectPaymentMethod = (paymentMethod: CheckoutPaymentMethod) => {
  if (paymentMethod === 'paypal' && discountCodeStore.isDiscountCodeSelected) return;

  cart.setSelectedPaymentMethod(paymentMethod);
};

onBeforeRouteLeave((to) => {
  if (to.name !== 'pay') {
    address.clearSelectedAddress();
    delivery.clearSelectedAddress();
    cart.clearSelectedPaymentMethod();
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
              class="border rounded-[20px] p-4 flex items-start gap-3 text-left transition-all duration-200 hover:-translate-y-px border-shori-gray-6 [background-color:color-mix(in_srgb,var(--gray-1)_85%,var(--gray-2))]"
              :class="
                delivery.isDeliveryTypeDelivery
                  ? 'border-shori-green-6 ring-2 ring-shori-green-6'
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
              class="border rounded-[20px] p-4 flex items-start gap-3 text-left transition-all duration-200 hover:-translate-y-px border-shori-gray-6 [background-color:color-mix(in_srgb,var(--gray-1)_85%,var(--gray-2))]"
              :class="
                delivery.isDeliveryTypePickup
                  ? 'border-shori-green-6 ring-2 ring-shori-green-6'
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

          <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              class="payment-method-card"
              :class="cart.selectedPaymentMethod === 'paypal' ? 'payment-method-card--active' : ''"
              :disabled="discountCodeStore.isDiscountCodeSelected"
              @click="selectPaymentMethod('paypal')"
            >
              <span class="payment-method-card__title">PayPal</span>
              <small class="payment-method-card__description"
                >Paga con tu cuenta PayPal o tarjeta.</small
              >
            </button>

            <button
              type="button"
              class="payment-method-card"
              :class="
                cart.selectedPaymentMethod === 'transferencia' ? 'payment-method-card--active' : ''
              "
              @click="selectPaymentMethod('transferencia')"
            >
              <span class="payment-method-card__title">Transferencia</span>
              <small class="payment-method-card__description"
                >Realiza depósito o transferencia bancaria.</small
              >
            </button>
          </div>

          <p
            v-if="discountCodeStore.isDiscountCodeSelected"
            class="mt-4 text-[0.85rem] text-shori-gray-10"
          >
            Con descuento aplicado, el pago disponible es transferencia.
          </p>
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

.payment-method-card {
  border: 1px solid color-mix(in srgb, var(--gray-6) 82%, transparent);
  border-radius: 16px;
  padding: 0.95rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: left;
  background: color-mix(in srgb, var(--gray-1) 86%, var(--gray-2));
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.payment-method-card:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: var(--green-7);
}

.payment-method-card--active {
  border-color: var(--green-7);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--green-6) 32%, transparent);
}

.payment-method-card:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.payment-method-card__title {
  font-size: 1.03rem;
  font-weight: 700;
  color: var(--gray-12);
}

.payment-method-card__description {
  color: var(--gray-10);
  line-height: 1.35;
}
</style>
