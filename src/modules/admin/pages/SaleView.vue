<script lang="ts" setup>
import { inject, onMounted, ref, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useSaleStore } from '@cart/stores/sale';
import { useRoute } from 'vue-router';
import { formatCurrency } from '@/helpers';
import LeftArrow from '@/modules/icons/ArrowLeft.vue';
import CustomModal from '@/modules/common/components/CustomModal.vue';
import { State } from '@/modules/cart/interfaces/sale.interface';
import FloatingOptions from '@/modules/layouts/components/FloatingOptions.vue';

const saleStore = useSaleStore();
const route = useRoute();

const customModalOpen = ref(false);
const toast: any = inject('toast');

const states = Object.values(State);

const floatingOptions = useTemplateRef<HTMLElement>('floating-options');

onClickOutside(floatingOptions, (event) => (customModalOpen.value = false));

onMounted(async () => {
  const { saleId } = route.params;
  await saleStore.getPurchaseById(parseInt(saleId as string));
});

const updateState = async (state: State) => {
  if (state === saleStore.purchaseInfo?.state) {
    customModalOpen.value = false;
    return;
  }
  try {
    await saleStore.updateState(state);
    toast.open({
      message: 'Estado actualizado correctamente',
      type: 'success',
    });
  } catch (error: any) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  } finally {
    customModalOpen.value = false;
  }
};
</script>

<template>
  <!-- <custom-modal :open="customModalOpen" @close="customModalOpen = false">
    <template #body>
      <ul class="space-y-1">
        <li
          v-for="(state, index) in states"
          :key="index"
          class="py-2 px-4 text-center cursor-pointer hover:opacity-90 rounded transition-colors"
          :class="{
            'bg-green-500 border-green-500': state === State.COMPLETED,
            'bg-orange-500 border-orange-500 ': state === State.PENDING,
            'bg-red-500 border-red-500': state === State.CANCELED,
            'bg-blue-600 border-blue-600 text-white': state === State.PAYPENDING,
          }"
          @click="updateState(state)"
        >
          {{ state.charAt(0).toUpperCase() + state.slice(1) }}
        </li>
      </ul>
    </template>
  </custom-modal> -->
  <div class="mt-6 mx-4 p-4 sm:p-6 xl:p-8 bg-shori-gray-1 shadow rounded-lg">
    <RouterLink
      :to="{ name: 'sales' }"
      class="inline-block ml-4 text-red-600 hover:bg-shori-gray-3 py-1 px-2 font-medium rounded-lg text-sm transition-colors"
    >
      <div class="flex gap-2 items-center justify-start">
        <LeftArrow class="w-6" />
        <p>Volver</p>
      </div>
    </RouterLink>
    <div class="max-w-screen-xl mx-auto my-8">
      <div class="mx-4 p-10 border border-shori-gray-6 rounded-lg">
        <p class="text-lg text-shori-gray-11">Gracias!</p>
        <div class="flex justify-between flex-wrap mb-2">
          <h1 class="text-3xl font-bold my-2">Detalles del pedido 🚀</h1>
          <div class="relative">
            <div
              @click="customModalOpen = true"
              class="h-fit inline-flex items-center rounded-full border px-2.5 py-2 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 capitalize cursor-pointer"
              :class="{
                'bg-green-500 border-green-500': saleStore.purchaseInfo?.state === State.COMPLETED,
                'bg-orange-500 border-orange-500': saleStore.purchaseInfo?.state === State.PENDING,
                'bg-red-500 border-red-500': saleStore.purchaseInfo?.state === State.CANCELED,
                'bg-blue-600 border-blue-600 text-white':
                  saleStore.purchaseInfo?.state === State.PAYPENDING,
              }"
            >
              {{ saleStore.purchaseInfo?.state }}
            </div>
            <floating-options ref="floating-options" class="-mt-5" v-if="customModalOpen">
              <template #options>
                <ul class="space-y-1">
                  <li
                    v-for="(state, index) in states"
                    :key="index"
                    class="h-fit w-28 items-center rounded-full border px-2.5 py-2 text-xs text-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 capitalize cursor-pointer"
                    :class="{
                      'bg-green-500 border-green-500': state === State.COMPLETED,
                      'bg-orange-500 border-orange-500': state === State.PENDING,
                      'bg-red-500 border-red-500': state === State.CANCELED,
                      'bg-blue-600 border-blue-600 text-white': state === State.PAYPENDING,
                    }"
                    @click="updateState(state)"
                  >
                    <p class="block">{{ state.charAt(0).toUpperCase() + state.slice(1) }}</p>
                  </li>
                </ul>
              </template>
            </floating-options>
          </div>
        </div>
        <p class="text-lg text-shori-gray-11 mb-5">
          Tu pedido está en camino. Te informaremos sobre las actualizaciones.
        </p>
        <div
          class="h-[4px] rounded-full bg-gradient-to-r from-green-500 from-30% to-transparent to-60%"
        ></div>

        <div class="py-7">
          <div class="text-shori-gray-12">
            <span class="mr-2">Número de pedido:</span
            ><span class="text-green-600 font-bold">{{ saleStore.purchaseInfo?.id }}</span>
          </div>
          <p class="text-shori-gray-12">
            Cliente: <span class="font-bold">{{ saleStore.purchaseInfo?.user?.name }}</span>
          </p>
          <p class="text-shori-gray-12">
            Método de pago:
            <span
              class="font-bold"
              :class="{
                'text-blue-600': saleStore.purchaseInfo?.payment_method === 'paypal',
                'text-orange-600': saleStore.purchaseInfo?.payment_method === 'transferencia',
              }"
              >{{ saleStore.purchaseInfo?.payment_method }}</span
            >
          </p>
          <p class="text-shori-gray-12">
            Método de envío:
            <span class="font-bold">{{ saleStore.purchaseInfo?.delivery_carrier?.name }}</span>
          </p>
        </div>

        <ul class="border border-shori-gray-6 rounded-md divide-y">
          <li
            v-for="sale_cart in saleStore.purchaseInfo?.sale_carts"
            :key="sale_cart.id"
            class="flex flex-col sm:flex-row gap-2 items-center p-4"
          >
            <img
              :src="sale_cart.product.product_galleries[0].url"
              :alt="`Imagen ${sale_cart.product.name}`"
              class="w-28"
            />
            <div class="flex flex-col flex-1">
              <span class="font-semibold text-shori-gray-12 mb-3">{{
                sale_cart.product.name
              }}</span>
              <span class="text-sm text-shori-gray-11">Cantidad: {{ sale_cart.quantity }}</span>
            </div>
            <span class="text-shori-gray-12">{{ formatCurrency(sale_cart.price_unit) }}</span>
          </li>
        </ul>

        <div class="mt-8 px-4">
          <h3 class="text-lg text-shori-gray-12">Dirección de entrega</h3>
          <div class="text-sm text-shori-gray-11 mt-3 mb-6">
            <p class="mb-1">
              {{
                `${saleStore.purchaseInfo?.address.street}, ${saleStore.purchaseInfo?.address.colony}, ${saleStore.purchaseInfo?.address.city}, ${saleStore.purchaseInfo?.address.state}, ${saleStore.purchaseInfo?.address.country}.`
              }}
            </p>
            <p>{{ saleStore.purchaseInfo?.address.phone }}</p>
          </div>

          <h3 class="text-lg text-shori-gray-12">Resumen</h3>
          <div class="text-sm text-shori-gray-11 mt-3 mb-6">
            <div class="flex justify-between mb-3">
              <span>Subtotal</span
              ><span class="text-base text-shori-gray-12 font-semibold">{{
                formatCurrency(saleStore.purchaseInfo?.amount_subtotal ?? 0)
              }}</span>
            </div>
            <div class="flex justify-between mb-3">
              <span>Envío</span>
              <span class="text-base text-shori-gray-12 font-semibold">{{
                formatCurrency(saleStore.purchaseInfo?.amount_shipping ?? 0)
              }}</span>
            </div>

            <div v-if="saleStore.purchaseInfo?.discount_code_id" class="flex justify-between mb-3">
              <span>Descuento</span>
              <span class="text-base text-shori-gray-12 font-semibold"
                >- {{ formatCurrency(saleStore.purchaseInfo?.discount_amount ?? 0) }}</span
              >
            </div>

            <div class="flex justify-between py-3 border-t border-shori-gray-6">
              <span class="text-base">Total</span>
              <span class="text-lg text-shori-gray-12 font-semibold">{{
                formatCurrency(saleStore.purchaseInfo?.amount_total!)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
