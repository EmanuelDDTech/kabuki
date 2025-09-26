<template>
  <main class="min-h-screen px-3 mb-8">
    <div class="max-w-screen-xl mx-auto block lg:flex gap-10 mt-8">
      <div class="flex-1">
        <section v-if="cart.isEmpty" class="flex-1 shadow-md border border-gray-100 p-4 rounded-lg">
          <h2 class="text-2xl font-bold border-b-2 border-gray-200 pb-3">Carrito</h2>
          <p class="text-slate-700 mt-6">
            No hay productos en el carrito.
            <router-link class="text-blue-600" :to="{ name: 'products' }"
              >Ver productos</router-link
            >
          </p>
        </section>
        <section
          v-if="!cart.isEmpty"
          class="flex-1 shadow-md border border-gray-100 p-4 rounded-lg"
        >
          <h2 class="text-2xl font-bold border-b-2 border-gray-200 pb-3">Carrito</h2>

          <CartProduct v-for="item in cart.items" :key="item.product.id" :item="item" />
        </section>

        <section
          v-if="!cart.isEmpty && userStore.isSet"
          class="mt-6 shadow-md border border-gray-100 p-4 rounded-lg"
        >
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
                  :options="[
                    'Aguascalientes',
                    'Baja California',
                    'Baja California Sur',
                    'Campeche',
                    'Chiapas',
                    'Chihuahua',
                    'Ciudad de México',
                    'Coahuila',
                    'Colima',
                    'Durango',
                    'Estado de México',
                    'Guanajuato',
                    'Guerrero',
                    'Hidalgo',
                    'Jalisco',
                    'Michoacán',
                    'Morelos',
                    'Nayarit',
                    'Nuevo León',
                    'Oaxaca',
                    'Puebla',
                    'Querétaro',
                    'Quintana Roo',
                    'San Luis Potosí',
                    'Sinaloa',
                    'Sonora',
                    'Tabasco',
                    'Tamaulipas',
                    'Tlaxcala',
                    'Veracruz',
                    'Yucatán',
                    'Zacatecas',
                  ]"
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

        <section v-if="!cart.isEmpty" class="mt-6 shadow-md border border-gray-100 p-4 rounded-lg">
          <h2 class="text-2xl font-bold border-b-2 border-gray-200 pb-3 mb-6">Método de envío</h2>

          <ul class="flex flex-wrap justify-around gap-6">
            <li
              v-for="deliveryData in delivery.deliveriesAvailable"
              :key="deliveryData.id"
              class="flex flex-col flex-1 min-h-full max-w-56 min-w-[130px] items-center cursor-pointer p-2 rounded-md border hover:border-blue-600 transition-colors hover:shadow hover:shadow-blue-600"
              @click="selectCarrier(deliveryData)"
              :class="
                deliveryData.id === delivery.carrierSelected?.id
                  ? 'border-blue-600 shadow shadow-blue-600'
                  : 'border-transparent'
              "
            >
              <div class="flex-1 flex items-center">
                <img :src="deliveryData.image" :alt="`Logo ${deliveryData.name}`" class="w-40" />
              </div>

              <h3 v-if="deliveryData.free_over" class="mt-2 text-center">
                {{ deliveryData.name }}
              </h3>

              <h3 class="font-bold text-lg">
                {{
                  formatCurrency(
                    deliveryData.free_over
                      ? 0
                      : deliveryData.delivery_price_rules[0].list_base_price,
                  )
                }}
              </h3>
            </li>
          </ul>
        </section>
      </div>

      <SideBard />
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
import { useAddressStore } from '../stores/address';
import LeftArrow from '@/modules/icons/ArrowLeft.vue';
import AddressCard from '../components/AddressCard.vue';
import Swal from 'sweetalert2';
import { useDeliveryStore } from '../stores/delivery';
import type { Delivery } from '../interfaces/delivery.interface';
import SideBard from '../components/SideBard.vue';
import { useUserStore } from '@/modules/auth/stores/user';

const userStore = useUserStore();
const address = useAddressStore();
const delivery = useDeliveryStore();
const cart = useCartStore();

const router = useRouter();

const toast: any = inject('toast');

onMounted(() => {
  address.getAddresses();
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
  } catch (error: any) {
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
  delivery.setAmountShipping(
    deliveryData.free_over ? 0 : deliveryData.delivery_price_rules[0].list_base_price,
  );
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
  router.push({ name: 'pay' });
};
</script>

<style scoped></style>
