<script lang="ts" setup>
import { formatCurrency } from '@/helpers';
import { useCartStore } from '../stores/cart';
import { useDeliveryStore } from '../stores/delivery';
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import { useAddressStore } from '../stores/address';
import { useUserStore } from '@/modules/auth/stores/user';

const cart = useCartStore();
const address = useAddressStore();
const delivery = useDeliveryStore();
const userStore = useUserStore();

const toast = inject('toast');

const router = useRouter();

const checkout = () => {
  if (address.selectedAddress === 0) {
    toast.open({
      message: 'No se ha seleccionado ninguna dirección de entrega',
      type: 'error',
    });

    return;
  }

  if (!delivery.isCarrierSelected) {
    toast.open({
      message: 'No se ha seleccionado ningún método de pago',
      type: 'error',
    });

    return;
  }

  cart.checkout();
  router.push({ name: 'pay' });
};
</script>

<template>
  <div>
    <aside class="h-full mt-6 lg:mt-0">
      <div
        v-if="cart.isEmpty"
        class="w-full max-w-96 lg:w-72 shadow-md border border-gray-100 p-4 rounded-lg sticky top-3 mx-auto"
      >
        <h3 class="text-lg flex justify-between text-slate-700">
          Aún no has agregado ningún producto al carrito
        </h3>

        <router-link
          :to="{ name: 'products' }"
          @click="checkout()"
          class="block text-center text-white w-full rounded-full bg-blue-600 hover:bg-blue-500 py-1 mt-3 text-sm transition-colors"
        >
          Ver productos
        </router-link>
      </div>
      <div
        v-if="!cart.isEmpty"
        class="w-full max-w-96 lg:w-72 shadow-md border border-gray-100 p-4 rounded-lg sticky top-3 mx-auto"
      >
        <h3 class="text-lg flex justify-between">
          Subtotal: <span class="font-bold">{{ formatCurrency(cart.total) }}</span>
        </h3>

        <h3
          v-if="delivery.isCarrierSelected"
          class="text-lg flex justify-between mt-2 pb-3 border-b-2 border-gray-100"
        >
          Envío: <span class="font-bold">{{ formatCurrency(delivery.amountShipping) }}</span>
        </h3>

        <h3 class="text-lg flex justify-between mt-3">
          Total:
          <span class="font-bold">{{ formatCurrency(cart.total + delivery.amountShipping) }}</span>
        </h3>

        <button
          v-show="!cart.payNow && userStore.isSet"
          @click="checkout()"
          class="block text-center w-full rounded-full bg-yellow-300 hover:bg-yellow-400 py-1 mt-3 text-sm transition-colors"
        >
          Proceder al pago
        </button>

        <router-link
          v-show="!cart.payNow && !userStore.isSet"
          :to="{ name: 'login' }"
          class="block text-center w-full rounded-full bg-yellow-300 hover:bg-yellow-400 py-1 mt-3 text-sm transition-colors"
        >
          Inicia sesión para pagar
        </router-link>
      </div>
    </aside>
  </div>
</template>
