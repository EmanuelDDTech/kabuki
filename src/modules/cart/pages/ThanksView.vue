<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
    <div class="max-w-xl w-full bg-white rounded-2xl shadow-lg p-6 text-center">
      <div class="text-green-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-16 h-16 mx-auto"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12l2 2 4-4m5 2a9 9 0 11-6.219-8.56"
          />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-800 mt-4">¡Gracias por tu compra!</h1>
      <p class="text-gray-600 mt-2">
        Tu pedido ha sido procesado exitosamente. Te enviaremos una confirmación a tu correo.
      </p>

      <div class="mt-6">
        <button
          @click="continueShopping"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Seguir comprando
        </button>
      </div>

      <div class="mt-4 text-sm text-gray-500">
        <p>
          Número de pedido: <span class="font-semibold">#{{ orderId }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMercadopagoStore } from '../stores/mercadopago';

// interface Props {
//   orderId?: String;
// }

// defineProps<Props>();

const route = useRoute();
const router = useRouter();

const mercadopagoStore = useMercadopagoStore();

const orderId = route.params.saleOrderId;

onMounted(async () => {
  const { mercadopago, payment_id } = route.query;

  if (mercadopago) {
    const result = await mercadopagoStore.processPayment(payment_id!.toString());
  }
});

const continueShopping = () => {
  router.push('/');
};
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
