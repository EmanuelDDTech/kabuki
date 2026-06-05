<script setup lang="ts">
import { inject } from 'vue';
import { FormKit, reset } from '@formkit/vue';
import Swal from 'sweetalert2';
import LeftArrow from '@/modules/icons/ArrowLeft.vue';
import AddressCard from './AddressCard.vue';
import { useAddressStore } from '../stores/address';

const address = useAddressStore();
const toast: any = inject('toast');

const saveAddress = async () => {
  try {
    const isNewAddress = address.newAddress.id === 0;

    await address.saveAddress();
    reset('newAddressForm');
    address.clearNewAddress();

    toast.open({
      message: isNewAddress
        ? 'Dirección creada correctamente'
        : 'Dirección actualizada correctamente',
      type: 'success',
    });

    setTimeout(() => {
      address.setCreateNew(false);
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
      address.setCreateNew(false);
    }, 1000);
  } catch (error: any) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};
</script>

<template>
  <section class="shadow-md border border-shori-gray-6 p-4 rounded-lg">
    <h2 class="text-2xl font-bold border-b-2 border-shori-gray-6 pb-3 mb-6">
      Dirección de entrega
    </h2>

    <div
      v-if="address.createNew"
      class="flex gap-2 items-center justify-start mb-4 text-red-700 font-medium rounded-lg text-sm cursor-pointer"
      @click="goBack()"
    >
      <LeftArrow class="w-6" />
      <p>Volver</p>
    </div>

    <div v-if="address.createNew">
      <FormKit
        id="newAddressForm"
        type="form"
        :actions="false"
        class="max-w-lg mx-auto p-4 space-y-4 bg-shori-gray-2 rounded shadow"
        @submit="saveAddress()"
      >
        <FormKit
          v-model="address.newAddress.country"
          type="select"
          name="country"
          label="País / Región"
          :options="['México', 'Estados Unidos']"
          validation="required"
          placeholder="Selecciona un país"
        />

        <FormKit
          v-model="address.newAddress.street"
          type="text"
          name="street"
          label="Dirección"
          validation="required"
          placeholder="Ingresa tu dirección"
        />

        <FormKit
          v-model="address.newAddress.colony"
          type="text"
          name="colony"
          label="Colonia"
          validation="required"
          placeholder="Ingresa tu colonia"
        />

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormKit
            v-model="address.newAddress.zip"
            type="text"
            name="zip"
            label="Código Postal"
            validation="required|matches:/^\d{5}$/"
            placeholder="XXXXX"
            :validation-messages="{
              required: 'El código postal es obligatorio',
              matches: 'Ingresa un código válido',
            }"
          />
          <FormKit
            v-model="address.newAddress.city"
            type="text"
            name="city"
            label="Ciudad"
            validation="required"
            placeholder="Ingresa tu ciudad"
          />
          <FormKit
            v-model="address.newAddress.state"
            type="select"
            name="state"
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

        <FormKit
          v-model="address.newAddress.phone"
          type="tel"
          name="phone"
          label="Teléfono"
          validation="required|matches:/^\d{10}$/"
          placeholder="Ingresa tu teléfono"
        />

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
        @click="address.selectAddress(addressData)"
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
</template>
