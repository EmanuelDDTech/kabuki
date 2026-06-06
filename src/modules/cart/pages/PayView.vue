<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue';
import { useAddressStore } from '../stores/address';
import { useCartStore } from '../stores/cart';
import { useDeliveryStore } from '../stores/delivery';
import SideBard from '../components/SideBard.vue';
import { useRouter } from 'vue-router';
import { useDiscountCodeStore } from '@/modules/discountCode/stores/discountCode';
import { useMercadopagoStore } from '../stores/mercadopago';
import { DeliveryCarrierType } from '../interfaces/delivery.interface';

const cart = useCartStore();
const address = useAddressStore();
const delivery = useDeliveryStore();
const discountCodeStore = useDiscountCodeStore();
const mercadopagoStore = useMercadopagoStore();

const router = useRouter();

const toast: any = inject('toast');

declare const MercadoPago: any;

onMounted(async () => {
  if (cart.isEmpty) {
    router.push({ name: 'cart' });
    return;
  }

  const requiresAddress = delivery.carrierSelected?.carrier_type !== DeliveryCarrierType.PICKUP;

  if (
    !delivery.isCarrierSelected ||
    (requiresAddress && !address.selectedAddress) ||
    !cart.payNow
  ) {
    router.push({ name: 'checkout' });
    return;
  }

  await Promise.all([addPaypalScript()]);
  // await Promise.all([addPaypalScript(), addMercadoPagoScript()]);
});

onUnmounted(() => {
  cart.payNow = false;
});

const addPaypalScript = () => {
  if (discountCodeStore.isDiscountCodeSelected) return;
  const scriptSdkPaypal = document.createElement('script');
  scriptSdkPaypal.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=MXN&components=buttons&disable-funding=venmo,paylater`;
  scriptSdkPaypal.onload = () => {
    createPaypalButtons();
  };
  // scriptSdkPaypal.data-sdk-integration-source = "developer-studio";

  document.head.append(scriptSdkPaypal);
};

const createPaypalButtons = () => {
  const paypal = (window as any).paypal;

  paypal
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
              itemsTotal: cart.subtotal,
              shippingAmount: delivery.amountShipping,
              shippingAddress: address.getSelectedAddress,
              discount: cart.discountAmount,
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

      async onApprove(data: any, actions: any) {
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

            const saleOrder = await cart.createSaleOrder(transaction.id, 'paypal');
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
  const saleOrder = await cart.createSaleOrder(null, 'transferencia');
  await cart.deleteCart();
  address.clearSelectedAddress();
  delivery.clearSelectedAddress();

  router.push({ name: 'thanks', params: { saleOrderId: saleOrder.order.id } });
};

const addMercadoPagoScript = async () => {
  const scriptSdkMercadoPago = document.createElement('script');
  scriptSdkMercadoPago.src = `https://sdk.mercadopago.com/js/v2`;
  scriptSdkMercadoPago.onload = async () => {
    const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

    await mercadopagoStore.createPreference();
    const preferenceId = mercadopagoStore.preferenceId;

    if (!preferenceId) {
      toast.open({
        message: 'No se pudo iniciar el proceso de pago con MercadoPago',
        type: 'error',
      });
      return;
    }

    const mp = new MercadoPago(publicKey);

    const bricksBuilder = mp.bricks();
    const renderWalletBrick = async (bricksBuilder: any) => {
      await bricksBuilder.create('wallet', 'walletBrick_container', {
        initialization: {
          preferenceId: preferenceId,
        },
        customization: {
          customStyle: {
            hideValueProp: true,
            borderRadius: '999px',
          },
        },
      });
    };

    renderWalletBrick(bricksBuilder);
  };

  document.head.append(scriptSdkMercadoPago);
};
</script>

<template>
  <main class="pay-page min-h-screen px-3 pb-10 pt-6">
    <div class="max-w-screen-xl mx-auto block lg:flex gap-8 xl:gap-10 mt-4">
      <div class="flex-1 min-w-0">
        <section class="pay-surface p-6 md:p-7">
          <header
            class="border-b pb-[0.95rem] [border-color:color-mix(in_srgb,var(--gray-6)_78%,transparent)]"
          >
            <p class="text-[0.72rem] uppercase tracking-[0.1em] text-shori-gray-10 font-bold">
              Paso final
            </p>
            <h2
              class="mt-[0.35rem] text-[clamp(1.35rem,2.2vw,1.95rem)] font-bold text-shori-gray-12"
            >
              Métodos de pago
            </h2>
            <p class="mt-2 text-[0.94rem] text-shori-gray-10">
              Selecciona tu forma de pago para completar la compra.
            </p>
          </header>

          <div
            v-show="cart.payNow && !discountCodeStore.isDiscountCodeSelected"
            class="mt-8 rounded-3xl border p-5 [border-color:color-mix(in_srgb,var(--gray-6)_82%,transparent)] [background:linear-gradient(165deg,color-mix(in_srgb,var(--gray-1)_86%,var(--gray-2)),color-mix(in_srgb,var(--gray-1)_78%,var(--gray-2)))]"
          >
            <h3 class="text-[1.6rem] font-bold text-shori-gray-12">PayPal</h3>
            <p class="mt-[0.35rem] text-shori-gray-10">
              Paga con tu cuenta PayPal, débito o tarjeta de crédito.
            </p>

            <div class="w-full max-w-[760px] mx-auto mt-5">
              <div id="paypal-button-container"></div>
            </div>
          </div>

          <!-- <div
            v-show="cart.payNow && !discountCodeStore.isDiscountCodeSelected"
            class="mt-10 flex flex-col"
          >
            <h3 class="text-2xl font-bold mb-3">Mercado Pago</h3>
            <div class="w-full max-w-[750px] mx-auto">
              <div id="walletBrick_container"></div>
            </div>
          </div> -->

          <div
            v-show="cart.payNow"
            class="mt-8 rounded-3xl border p-5 [border-color:color-mix(in_srgb,var(--gray-6)_82%,transparent)] [background:linear-gradient(165deg,color-mix(in_srgb,var(--gray-1)_86%,var(--gray-2)),color-mix(in_srgb,var(--gray-1)_78%,var(--gray-2)))]"
          >
            <h3 class="text-[1.6rem] font-bold text-shori-gray-12">Depósito o Transferencia</h3>

            <div class="mt-4 grid gap-[0.35rem] text-shori-gray-11 text-[1.03rem]">
              <p>Clave: <span class="font-semibold">012 320 02838694095 8</span></p>
              <p>Si eres BBVA: <span class="font-semibold">283 869 4095</span></p>
              <p>Beneficiario: <span class="font-semibold">Francisco Javier Ramos S</span></p>
            </div>
            <div class="bg-red-100 text-black p-3 rounded mt-3">
              <p>
                <span class="text-red-900 text-lg">¡Importante!</span> Al seleccionar transferencia
                tendrás 24 horas para realizar el depósito o transferencia. Si no se realiza el pago
                dentro de ese tiempo el pedido será cancelado.
              </p>
            </div>

            <button
              @click="createTransferOrder"
              class="mt-7 w-full max-w-[760px] inline-flex justify-center items-center rounded-full bg-gradient-to-br from-shori-green-8 to-shori-green-9 text-shori-green-contrast text-[1.2rem] font-bold py-[0.82rem] px-4 transition duration-150 hover:brightness-105"
            >
              Seleccionar Transferencia
            </button>
          </div>
        </section>
      </div>

      <SideBard checkout-step="payment" />
    </div>
  </main>
</template>

<style scoped>
/* .pay-page {
  background:
    radial-gradient(circle at 12% 12%, color-mix(in srgb, var(--green-3) 58%, transparent), transparent 34%),
    radial-gradient(circle at 85% 10%, color-mix(in srgb, var(--gray-3) 75%, transparent), transparent 35%),
    var(--color-background);
} */

.pay-surface {
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

.transfer-alert {
  border-radius: 14px;
  padding: 0.85rem 1rem;
  background-color: color-mix(in srgb, var(--green-3) 65%, var(--gray-2));
  border: 1px solid var(--green-6);
  color: var(--gray-12);
}
</style>
