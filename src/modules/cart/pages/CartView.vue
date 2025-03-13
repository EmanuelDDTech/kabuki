<template>
  <main class="min-h-screen px-3 mb-8">
    <div class="max-w-screen-xl mx-auto block lg:flex gap-10 mt-8">
      <div class="flex-1">
        <section class="flex-1 shadow-md border border-gray-100 p-4 rounded-lg">
          <h2 class="text-2xl font-bold border-b-2 border-gray-200 pb-3">Carrito</h2>

          <CartProduct v-for="item in cart.items" :key="item.product.id" :item="item" />
        </section>

        <section class="mt-6 shadow-md border border-gray-100 p-4 rounded-lg">
          <h2 class="text-2xl font-bold border-b-2 border-gray-200 pb-3 mb-6">
            Dirección de entrega
          </h2>

          <div
            v-if="address.createNew"
            @click="goBack()"
            class="flex gap-2 items-center justify-start mb-4 text-red-700 font-medium rounded-lg text-sm cursor-pointer"
          >
            <LeftArrow class="w-6" />
            <p>Volver</p>
          </div>

          <div v-if="address.createNew">
            <FormKit
              id="newAddressForm"
              type="form"
              @submit="saveAddress()"
              :actions="false"
              class="max-w-lg mx-auto p-4 space-y-4 bg-white rounded shadow"
            >
              <!-- País / Región -->
              <FormKit
                type="select"
                name="country"
                v-model="address.newAddress.country"
                label="País / Región"
                :options="['México', 'Estados Unidos']"
                validation="required"
                placeholder="Selecciona un país"
              />

              <!-- Dirección -->
              <FormKit
                type="text"
                name="street"
                v-model="address.newAddress.street"
                label="Dirección"
                validation="required"
                placeholder="Ingresa tu dirección"
              />

              <!-- Colonia -->
              <FormKit
                type="text"
                name="colony"
                v-model="address.newAddress.colony"
                label="Colonia"
                validation="required"
                placeholder="Ingresa tu colonia"
              />

              <!-- Código Postal, Ciudad, Estado -->
              <div class="grid grid-cols-3 gap-4">
                <FormKit
                  type="text"
                  name="zip"
                  v-model="address.newAddress.zip"
                  label="Código Postal"
                  validation="required|matches:/^\d{5}$/"
                  placeholder="XXXXX"
                  :validation-messages="{
                    required: 'El código postal es obligatorio',
                    matches: 'Ingresa un código válido',
                  }"
                />
                <FormKit
                  type="text"
                  name="city"
                  v-model="address.newAddress.city"
                  label="Ciudad"
                  validation="required"
                  placeholder="Ingresa tu ciudad"
                />
                <FormKit
                  type="select"
                  name="state"
                  v-model="address.newAddress.state"
                  label="Estado"
                  :options="['Jalisco', 'CDMX', 'Nuevo León']"
                  validation="required"
                  placeholder="Selecciona un estado"
                />
              </div>

              <!-- Teléfono -->
              <FormKit
                type="tel"
                name="phone"
                v-model="address.newAddress.phone"
                label="Teléfono"
                validation="required|matches:/^\d{10}$/"
                placeholder="Ingresa tu teléfono"
              />

              <!-- Checkbox -->
              <!-- <FormKit
                type="checkbox"
                name="saveInfo"
                label="Guardar la información de envio"
                wrapper-class="flex items-center gap-2"
                label-class="!mt-0"
              /> -->

              <!-- Botón de envío -->
              <FormKit
                type="submit"
                label="Confirmar Dirección"
                button-class="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-3"
              />
            </FormKit>

            <button
              v-if="address.newAddress.id !== 0"
              class="text-red-500 mt-3"
              @click.stop="deleteConfirmation(address.newAddress.id)"
            >
              Eliminar dirección
            </button>
          </div>

          <div v-if="!address.createNew" class="mb-3 flex flex-col gap-3">
            <AddressCard
              v-for="addressData in address.savedAddresses"
              :key="addressData.id"
              :address="addressData"
              :selected="address.isSelected(addressData.id)"
              @click="address.selectAddress(addressData.id)"
              @edit="address.editAddress(addressData)"
            />
          </div>

          <div v-if="!address.createNew">
            <button
              class="bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-bold w-full p-3 mt-3"
              @click="address.setCreateNew(true)"
            >
              Agregar nueva dirección
            </button>
          </div>
        </section>

        <section class="mt-6 shadow-md border border-gray-100 p-4 rounded-lg">
          <h2 class="text-2xl font-bold border-b-2 border-gray-200 pb-3 mb-6">Método de envío</h2>

          <ul class="flex justify-around items-center gap-6">
            <li
              v-for="deliveryData in delivery.deliveriesAvailable"
              :key="deliveryData.id"
              class="flex flex-col items-center cursor-pointer p-2 rounded-md border hover:border-blue-600 transition-colors hover:shadow hover:shadow-blue-600"
              @click="selectCarrier(deliveryData)"
              :class="
                deliveryData.id === delivery.carrierSelected?.id
                  ? 'border-blue-600 shadow shadow-blue-600'
                  : 'border-transparent'
              "
            >
              <img :src="deliveryData.image" :alt="`Logo ${deliveryData.name}`" class="w-40" />
              <h3 class="font-bold text-lg">
                {{ formatCurrency(deliveryData.delivery_price_rules[0].list_base_price) }}
              </h3>
            </li>
          </ul>
        </section>
      </div>

      <div>
        <aside class="h-full mt-6 lg:mt-0">
          <div
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
              <span class="font-bold">{{
                formatCurrency(cart.total + delivery.amountShipping)
              }}</span>
            </h3>

            <button
              v-show="!cart.payNow"
              @click="checkout()"
              class="block text-center w-full rounded-full bg-yellow-300 hover:bg-yellow-400 py-1 mt-3 text-sm transition-colors"
            >
              Proceder al pago
            </button>

            <div v-show="cart.payNow" class="mt-3">
              <div id="paypal-button-container"></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CartProduct from '../components/CartProduct.vue';
import { useCartStore } from '../stores/cart';
import { formatCurrency } from '@/helpers';
import { FormKit, reset } from '@formkit/vue';
// import { AddressValidationClient } from '@googlemaps/addressvalidation';
import { useAddressStore } from '../stores/address';
import LeftArrow from '@/modules/icons/ArrowLeft.vue';
import AddressCard from '../components/AddressCard.vue';
import Swal from 'sweetalert2';
import { useDeliveryStore } from '../stores/delivery';
import type { Delivery } from '../interfaces/delivery.interface';

const cart = useCartStore();
const address = useAddressStore();
const delivery = useDeliveryStore();

const router = useRouter();

const toast = inject('toast');

onMounted(() => {
  address.getAddresses();

  addPaypalScript();
});

const saveAddress = async () => {
  try {
    await address.saveAddress();

    reset('newAddressForm');

    const message =
      address.newAddress.id === 0
        ? 'Dirección creada correctamente'
        : 'Dirección actualizada correctamente';
    address.clearNewAddress();

    toast.open({
      message: message,
      type: 'success',
    });

    setTimeout(() => {
      address.createNew = false;
    }, 1000);
  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};

const goBack = () => {
  address.setCreateNew(false);
  address.clearNewAddress();
};

const deleteConfirmation = (id: number) => {
  Swal.fire({
    title: 'Seguro quieres eliminar esta dirección?',
    text: 'No podrá ser revertido!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Eliminar!',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteAddress(id);
    }
  });
};

const deleteAddress = async (id: number) => {
  try {
    await address.deleteAddress(id);
    toast.open({
      message: 'Dirección eliminada correctamente',
      type: 'success',
    });

    setTimeout(() => {
      address.createNew = false;
    }, 1000);
  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};

const selectCarrier = async (deliveryData: Delivery) => {
  delivery.setAmountShipping(deliveryData.delivery_price_rules[0].list_base_price);
  delivery.setCarrierSelected(deliveryData);
};

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
};

const addPaypalScript = () => {
  const scriptSdkPaypal = document.createElement('script');
  scriptSdkPaypal.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=MXN&components=buttons&disable-funding=venmo,paylater,card`;
  scriptSdkPaypal.onload = () => {
    createPaypalButtons();
  };
  // scriptSdkPaypal.data-sdk-integration-source = "developer-studio";

  document.head.append(scriptSdkPaypal);
};

const createPaypalButtons = () => {
  window.paypal
    .Buttons({
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
</script>

<style scoped></style>
