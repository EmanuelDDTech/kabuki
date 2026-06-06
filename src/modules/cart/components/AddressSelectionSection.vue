<script setup lang="ts">
import { inject } from 'vue';
import { FormKit, reset } from '@formkit/vue';
import Swal from 'sweetalert2';
import AddressCard from './AddressCard.vue';
import CustomModal from '@/modules/common/components/CustomModal.vue';
import { useAddressStore } from '../stores/address';

const address = useAddressStore();
const toast: any = inject('toast');

const saveAddress = async () => {
  try {
    const isNewAddress = address.newAddress.id === 0;

    await address.saveAddress();
    reset('newAddressForm');
    address.clearNewAddress();
    address.setCreateNew(false);

    toast.open({
      message: isNewAddress
        ? 'Dirección creada correctamente'
        : 'Dirección actualizada correctamente',
      type: 'success',
    });
  } catch (error: any) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};

const closeAddressModal = () => {
  address.setCreateNew(false);
  address.clearNewAddress();
};

const openCreateModal = () => {
  address.clearNewAddress();
  address.setCreateNew(true);
};

const deleteConfirmation = (id: number) => {
  Swal.fire({
    title: 'Seguro quieres eliminar esta dirección?',
    text: 'No podrá ser revertido!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'var(--green-9)',
    cancelButtonColor: 'var(--gray-9)',
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

    address.setCreateNew(false);
  } catch (error: any) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};
</script>

<template>
  <section class="checkout-surface p-6 md:p-7">
    <header class="checkout-headline">
      <p class="checkout-eyebrow">Paso 2</p>
      <h2 class="checkout-title">Dirección de entrega</h2>
      <p class="checkout-copy">
        Selecciona una dirección guardada o crea una nueva desde el formulario modal.
      </p>
    </header>

    <div v-if="!address.savedAddresses.length" class="empty-address mt-6">
      <p class="text-sm text-shori-gray-10">Aún no tienes direcciones guardadas.</p>
      <button class="primary-btn mt-4" @click="openCreateModal">Agregar nueva dirección</button>
    </div>

    <div v-else class="mt-6 grid grid-cols-1 gap-4">
      <AddressCard
        v-for="addressData in address.savedAddresses"
        :key="addressData.id"
        :address="addressData"
        :selected="address.isSelected(addressData.id)"
        @click="address.selectAddress(addressData)"
        @edit="address.editAddress(addressData)"
      />

      <button class="secondary-btn mt-2" @click="openCreateModal">Agregar nueva dirección</button>
    </div>

    <CustomModal :open="address.createNew" @close="closeAddressModal">
      <template #body>
        <div class="address-modal">
          <div class="address-modal-head">
            <h3 class="text-xl font-bold text-shori-gray-12">
              {{ address.newAddress.id === 0 ? 'Nueva dirección' : 'Editar dirección' }}
            </h3>
            <button
              type="button"
              class="close-btn"
              aria-label="Cerrar modal de dirección"
              @click="closeAddressModal"
            >
              ✕
            </button>
          </div>

          <FormKit
            id="newAddressForm"
            type="form"
            :actions="false"
            class="space-y-4"
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

            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
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

            <div class="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" class="cancel-btn" @click="closeAddressModal">Cancelar</button>

              <FormKit
                type="submit"
                :label="address.newAddress.id === 0 ? 'Guardar dirección' : 'Actualizar dirección'"
                button-class="primary-btn"
              />
            </div>
          </FormKit>

          <button
            v-if="address.newAddress.id !== 0"
            class="delete-link"
            @click.stop="deleteConfirmation(address.newAddress.id)"
          >
            Eliminar dirección
          </button>
        </div>
      </template>
    </CustomModal>
  </section>
</template>

<style scoped>
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

.checkout-headline {
  border-bottom: 1px solid color-mix(in srgb, var(--gray-6) 78%, transparent);
  padding-bottom: 0.95rem;
}

.checkout-eyebrow {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gray-10);
  font-weight: 700;
}

.checkout-title {
  margin-top: 0.35rem;
  font-size: clamp(1.35rem, 2.2vw, 1.9rem);
  font-weight: 700;
  color: var(--gray-12);
}

.checkout-copy {
  margin-top: 0.5rem;
  font-size: 0.94rem;
  color: var(--gray-10);
}

.empty-address {
  border: 1px dashed var(--gray-7);
  border-radius: 18px;
  padding: 1rem;
  background-color: color-mix(in srgb, var(--gray-1) 84%, var(--gray-2));
}

.primary-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 14px;
  background: linear-gradient(140deg, var(--green-8), var(--green-9));
  color: var(--green-contrast);
  padding: 0.76rem 1rem;
  font-size: 0.95rem;
  font-weight: 700;
  transition: filter 150ms ease;
}

.primary-btn:hover {
  filter: brightness(1.03);
}

.secondary-btn {
  border-radius: 14px;
  border: 1px dashed var(--gray-7);
  background-color: color-mix(in srgb, var(--gray-1) 82%, var(--gray-2));
  color: var(--gray-11);
  padding: 0.76rem 1rem;
  font-weight: 700;
}

.address-modal {
  max-height: min(78vh, 840px);
  overflow-y: auto;
  padding-right: 0.2rem;
}

.address-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.close-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--gray-6);
  color: var(--gray-10);
}

.cancel-btn {
  border-radius: 14px;
  border: 1px solid var(--gray-6);
  color: var(--gray-11);
  padding: 0.76rem 1rem;
  font-weight: 600;
}

.delete-link {
  margin-top: 0.85rem;
  color: var(--gray-11);
  font-size: 0.88rem;
  font-weight: 600;
}
</style>
