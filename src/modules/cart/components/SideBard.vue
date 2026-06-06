<script lang="ts" setup>
import { formatCurrency } from '@/helpers';
import { useCartStore } from '../stores/cart';
import { useDeliveryStore } from '../stores/delivery';
import { computed, inject, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { useAddressStore } from '../stores/address';
import { useUserStore } from '@/modules/auth/stores/user';
import { useDiscountCodeStore } from '@/modules/discountCode/stores/discountCode';
import { useProductsCategory } from '@/composables/useProductsCategory';
import { DeliveryCarrierType } from '../interfaces/delivery.interface';

type CheckoutStep = 'cart' | 'delivery' | 'payment';

const props = withDefaults(
  defineProps<{
    checkoutStep?: CheckoutStep;
  }>(),
  {
    checkoutStep: 'cart',
  },
);

const cart = useCartStore();
const address = useAddressStore();
const delivery = useDeliveryStore();
const userStore = useUserStore();
const discountCodeStore = useDiscountCodeStore();

const toast: any = inject('toast');
const discountCodeInput = shallowRef('');

const router = useRouter();
const { currentProductsCategory } = useProductsCategory();

const showCheckoutAction = computed(() => !cart.payNow && props.checkoutStep !== 'payment');

const shouldShowLoginAction = computed(
  () => props.checkoutStep === 'cart' && !userStore.isSet && !cart.payNow,
);

const shouldShowCheckoutAction = computed(() => {
  if (!showCheckoutAction.value) return false;
  if (props.checkoutStep === 'cart') return userStore.isSet;

  return true;
});

const canContinueToPayment = computed(() => {
  if (props.checkoutStep !== 'delivery') return true;
  if (!delivery.isCarrierSelected) return false;

  const requiresAddress = delivery.carrierSelected?.carrier_type !== DeliveryCarrierType.PICKUP;
  const hasRequiredAddress = requiresAddress ? Boolean(address.selectedAddress) : true;

  return hasRequiredAddress && cart.hasSelectedPaymentMethod;
});

const checkoutActionLabel = computed(() =>
  props.checkoutStep === 'delivery' ? 'Realizar pago' : 'Continuar con el pedido',
);

const checkout = () => {
  if (props.checkoutStep === 'cart') {
    router.push({ name: 'checkout' });
    return;
  }

  const requiresAddress = delivery.carrierSelected?.carrier_type !== DeliveryCarrierType.PICKUP;

  if (requiresAddress && !address.selectedAddress) {
    toast.open({
      message: 'No se ha seleccionado ninguna dirección de entrega',
      type: 'error',
    });

    return;
  }

  if (!delivery.isCarrierSelected) {
    toast.open({
      message: 'No se ha seleccionado ningún método de envío',
      type: 'error',
    });

    return;
  }

  if (!cart.hasSelectedPaymentMethod) {
    toast.open({
      message: 'Selecciona un método de pago para continuar',
      type: 'error',
    });

    return;
  }

  cart.checkout();
  router.push({ name: 'pay' });
};

const applyDiscountCode = async () => {
  if (!discountCodeInput.value.trim()) {
    toast.open({
      message: 'No se ha escrito ningún código',
      type: 'error',
    });
    return;
  }

  try {
    await discountCodeStore.getDiscountCodeByCode(discountCodeInput.value.trim());

    discountCodeInput.value = '';

    toast.open({
      message: 'Código de descuento aplicado',
      type: 'success',
    });
  } catch (error: any) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};
</script>

<template>
  <div>
    <aside class="h-full mt-6 lg:mt-0">
      <div v-if="cart.isEmpty" class="cart-summary-card w-full max-w-[360px] sticky top-4 mx-auto">
        <h3 class="text-lg font-semibold text-shori-gray-12">Tu carrito está vacío</h3>
        <p class="mt-2 text-sm text-shori-gray-10">
          Agrega productos para continuar con tu compra.
        </p>

        <router-link
          :to="{ name: 'products', params: { category: currentProductsCategory } }"
          class="summary-action summary-action--secondary"
        >
          Ver productos
        </router-link>
      </div>
      <div v-if="!cart.isEmpty" class="cart-summary-card w-full max-w-[360px] sticky top-4 mx-auto">
        <div class="summary-header">
          <div>
            <p class="summary-eyebrow">Resumen</p>
            <h3 class="summary-title">Orden ({{ cart.cartLength }})</h3>
          </div>
        </div>

        <div class="w-full mb-6">
          <label for="discount-code" class="summary-label">Código de descuento</label>

          <div class="summary-discount-wrapper">
            <input
              type="text"
              id="discount-code"
              v-model="discountCodeInput"
              placeholder="Ingresa tu código"
              class="summary-discount-input"
              :disabled="discountCodeStore.isDiscountCodeSelected"
            />
            <button
              class="summary-discount-btn"
              @click="applyDiscountCode"
              :disabled="discountCodeStore.isDiscountCodeSelected"
            >
              Aplicar
            </button>
          </div>

          <p v-if="discountCodeStore.isDiscountCodeSelected" class="summary-discount-chip">
            Código aplicado: {{ discountCodeStore.selectedDiscountCode?.code }}
          </p>
        </div>

        <div class="summary-rows">
          <div class="summary-row">
            <span>Subtotal</span>
            <strong>{{ formatCurrency(cart.subtotal) }}</strong>
          </div>
          <div class="summary-row">
            <span>Envío</span>
            <strong>{{ formatCurrency(delivery.amountShipping) }}</strong>
          </div>
        </div>

        <div
          v-if="discountCodeStore.isDiscountCodeSelected"
          class="summary-row summary-row--discount"
        >
          <span>Descuento</span>
          <strong>- {{ formatCurrency(cart.discountAmount) }}</strong>
        </div>

        <div class="summary-total">
          <span>Total</span>
          <strong>{{ formatCurrency(cart.total) }}</strong>
        </div>

        <button
          v-show="shouldShowCheckoutAction"
          @click="checkout()"
          class="summary-action summary-action--primary"
          :disabled="props.checkoutStep === 'delivery' && !canContinueToPayment"
        >
          {{ checkoutActionLabel }}
        </button>

        <router-link
          v-show="shouldShowLoginAction"
          :to="{ name: 'login' }"
          class="summary-action summary-action--primary"
        >
          Inicia sesión para continuar
        </router-link>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.cart-summary-card {
  border-radius: 24px;
  border: 1px solid color-mix(in srgb, var(--gray-6) 80%, transparent);
  /* background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--green-3) 55%, transparent), transparent 62%),
    color-mix(in srgb, var(--gray-1) 88%, var(--gray-2)); */
  box-shadow:
    0 28px 56px rgba(19, 35, 64, 0.1),
    0 8px 20px rgba(12, 20, 32, 0.08);
  padding: 1.2rem;
}

.summary-header {
  margin-bottom: 1rem;
}

.summary-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gray-10);
}

.summary-title {
  margin-top: 0.25rem;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--gray-12);
}

.summary-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--gray-10);
}

.summary-discount-wrapper {
  display: flex;
  gap: 0.5rem;
}

.summary-discount-input {
  width: 100%;
  border-radius: 14px;
  border: 1px solid var(--gray-6);
  background-color: color-mix(in srgb, var(--gray-1) 82%, var(--gray-2));
  padding: 0.62rem 0.85rem;
  color: var(--gray-12);
  transition: border-color 150ms ease;
}

.summary-discount-input:focus {
  outline: none;
  border-color: var(--green-8);
}

.summary-discount-input:disabled {
  opacity: 0.75;
}

.summary-discount-btn {
  border-radius: 14px;
  border: 1px solid transparent;
  background: linear-gradient(130deg, var(--green-8), var(--green-9));
  color: var(--green-contrast);
  font-weight: 700;
  padding: 0.62rem 0.95rem;
  transition:
    transform 180ms ease,
    filter 180ms ease;
}

.summary-discount-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.04);
}

.summary-discount-btn:disabled {
  cursor: not-allowed;
  filter: grayscale(0.15);
}

.summary-discount-chip {
  margin-top: 0.65rem;
  font-size: 0.78rem;
  color: var(--green-11);
  font-weight: 600;
}

.summary-rows {
  display: grid;
  gap: 0.5rem;
  padding: 0.8rem 0;
  border-top: 1px solid color-mix(in srgb, var(--gray-6) 80%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--gray-6) 80%, transparent);
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.97rem;
  color: var(--gray-11);
}

.summary-row strong {
  color: var(--gray-12);
}

.summary-row--discount {
  margin-top: 0.75rem;
  color: var(--green-11);
}

.summary-row--discount strong {
  color: var(--green-11);
}

.summary-total {
  margin-top: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.22rem;
  font-weight: 700;
  color: var(--gray-12);
}

.summary-action {
  width: 100%;
  margin-top: 0.9rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
  padding: 0.72rem 1rem;
  font-size: 0.95rem;
  font-weight: 700;
  transition:
    transform 180ms ease,
    filter 180ms ease;
}

.summary-action:hover {
  transform: translateY(-1px);
}

.summary-action--primary {
  background: linear-gradient(140deg, var(--green-8), var(--green-9));
  color: var(--green-contrast);
  /* box-shadow: 0 16px 24px color-mix(in srgb, var(--green-9) 40%, transparent); */
}

.summary-action--primary:disabled {
  cursor: not-allowed;
  filter: grayscale(0.2) opacity(0.7);
  transform: none;
  box-shadow: none;
}

.summary-action--secondary {
  background-color: color-mix(in srgb, var(--gray-1) 80%, var(--gray-2));
  color: var(--gray-12);
  border: 1px solid var(--gray-6);
}

@media (max-width: 1023px) {
  .cart-summary-card {
    position: static;
  }
}
</style>
