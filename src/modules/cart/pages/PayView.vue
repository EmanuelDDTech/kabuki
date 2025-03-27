<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue';
import { useAddressStore } from '../stores/address';
import { useCartStore } from '../stores/cart';
import { useDeliveryStore } from '../stores/delivery';
import SideBard from '../components/SideBard.vue';
import { useRouter } from 'vue-router';

const cart = useCartStore();
const address = useAddressStore();
const delivery = useDeliveryStore();

const router = useRouter();

const toast = inject('toast');

onMounted(() => {
  if (cart.isEmpty || !delivery.isCarrierSelected || address.selectedAddress === 0)
    router.push({ name: 'cart' });
  addPaypalScript();
});

onUnmounted(() => {
  cart.payNow = false;
});

const addPaypalScript = () => {
  const scriptSdkPaypal = document.createElement('script');
  scriptSdkPaypal.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=MXN&components=buttons&disable-funding=venmo,paylater`;
  scriptSdkPaypal.onload = () => {
    createPaypalButtons();
  };
  // scriptSdkPaypal.data-sdk-integration-source = "developer-studio";

  document.head.append(scriptSdkPaypal);
};

const createPaypalButtons = () => {
  window.paypal
    .Buttons({
      expandCardForm: true,
      style: {
        shape: 'pill',
        layout: 'vertical',
        color: 'blue',
        label: 'paypal',
      },
      message: {
        amount: 100,
      },

      async createOrder() {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/paypal/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // use the "body" param to optionally pass additional order information
            // like product ids and quantities
            body: JSON.stringify({
              cart: cart.paypalCart,
              itemsTotal: cart.total,
              shippingAmount: delivery.amountShipping,
              shippingAddress: address.getSelectedAddress,
            }),
          });

          const orderData = await response.json();

          if (orderData.id) {
            return orderData.id;
          }
          const errorDetail = orderData?.details?.[0];
          const errorMessage = errorDetail
            ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
            : JSON.stringify(orderData);

          throw new Error(errorMessage);
        } catch (error) {
          console.error(error);
          // resultMessage(`Could not initiate PayPal Checkout...<br><br>${error}`);
        }
      },

      async onApprove(data, actions) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/paypal/orders/${data.orderID}/capture`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          const orderData = await response.json();
          // Three cases to handle:
          //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          //   (2) Other non-recoverable errors -> Show a failure message
          //   (3) Successful transaction -> Show confirmation or thank you message
          const errorDetail = orderData?.details?.[0];
          if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            // recoverable state, per
            // https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
            return actions.restart();
          } else if (errorDetail) {
            // (2) Other non-recoverable errors -> Show a failure message
            throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
          } else if (!orderData.purchase_units) {
            throw new Error(JSON.stringify(orderData));
          } else {
            // (3) Successful transaction -> Show confirmation or thank you message
            // Or go to another URL:  actions.redirect('thank_you.html');
            const transaction =
              orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
              orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];

            const saleOrder = await cart.createSaleOrder(transaction.id);
            await cart.deleteCart();
            address.clearSelectedAddress();
            delivery.clearSelectedAddress();

            router.push({ name: 'thanks', params: { saleOrderId: saleOrder.order.id } });

            //   resultMessage(
            //     `Transaction ${transaction.status}: ${transaction.id}<br>
            // <br>See console for all available details`,
            //   );
            // console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
          }
        } catch (error) {
          console.error(error);
          // resultMessage(`Sorry, your transaction could not be processed...<br><br>${error}`);
        }
      },
    })
    .render('#paypal-button-container');
};

const createTransferOrder = async () => {
  const saleOrder = await cart.createSaleOrder(null);
  await cart.deleteCart();
  address.clearSelectedAddress();
  delivery.clearSelectedAddress();

  router.push({ name: 'thanks', params: { saleOrderId: saleOrder.order.id } });
};
</script>

<template>
  <main class="min-h-screen px-3 mb-8">
    <div class="max-w-screen-xl mx-auto block lg:flex gap-10 mt-8">
      <div class="flex-1">
        <section class="flex-1 shadow-md border border-gray-100 p-4 rounded-lg">
          <h2 class="text-2xl font-bold border-b-2 border-gray-200 pb-3">Métodos de pago</h2>
          <div v-show="cart.payNow" class="mt-10 flex flex-col">
            <h3 class="text-2xl font-bold mb-3">Paypal</h3>
            <div class="w-[750px] mx-auto">
              <div id="paypal-button-container"></div>
            </div>
          </div>

          <div v-show="cart.payNow" class="mt-10 flex flex-col">
            <h3 class="text-2xl font-bold mb-3">Depósito o Transferencia</h3>
            <div>
              <p>Clave: <span class="font-semibold">012 320 02838694095 8</span></p>
              <p>Si eres BBVA: <span class="font-semibold">283 869 4095 </span></p>
              <p>Beneficiario: <span class="font-semibold">Francisco Javier Ramos S</span></p>
            </div>
            <div class="bg-red-100 p-3 rounded mt-3">
              <p>
                <Span class="text-red-900 text-lg">¡Importante!</Span> Al seleccionar transferencia
                tendrás 24 horas para realizar el depósito o transferencia. Si no se realiza el pago
                dentro de ese tiempo el pedido será cancelado.
              </p>
            </div>

            <button
              @click="createTransferOrder"
              class="mt-6 text-xl text-white font-semibold py-2 px-4 rounded-full bg-orange-600 hover:bg-orange-500 cursor-pointer w-[750px] mx-auto"
            >
              Seleccionar Transferencia
            </button>
          </div>
        </section>
      </div>

      <SideBard />
    </div>
  </main>
</template>
