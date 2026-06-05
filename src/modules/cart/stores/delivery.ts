import { defineStore } from 'pinia';
import type { Delivery } from '../interfaces/delivery.interface';
import { computed, ref, watch } from 'vue';
import DeliveryAPI from '../api/DeliveryAPI';
import { useAddressStore } from './address';
import { useUserStore } from '@/modules/auth/stores/user';

export const useDeliveryStore = defineStore('delivery', () => {
  const carriers = ref<Delivery[] | []>([]);
  const deliveriesAvailable = ref<Delivery[] | []>([]);
  const amountShipping = ref<number>(0);
  const carrierSelected = ref<Delivery | null>(null);
  const productsIds = ref<number[]>([]);

  const addressStore = useAddressStore();
  const userStore = useUserStore();

  const findDeliveriesAvailable = async () => {
    const zipCode = addressStore.getSelectedAddress?.zip;
    const userId = userStore.user?.id;

    if (!zipCode || (!userId && !productsIds.value.length)) {
      deliveriesAvailable.value = [];
      return;
    }

    try {
      const { data } = await DeliveryAPI.findAvailable({
        zipCode,
        productsIds: productsIds.value,
        userId,
      });
      deliveriesAvailable.value = data.options;
    } catch (error) {
      console.log(error);
    }
  };

  const setProductsIds = (ids: number[]) => {
    productsIds.value = [...ids];
  };

  watch(
    [() => addressStore.getSelectedAddress, () => [...productsIds.value], () => userStore.user?.id],
    () => {
      findDeliveriesAvailable();
    },
    { deep: true, immediate: true },
  );

  const setAmountShipping = (amount: number) => {
    amountShipping.value = amount;
  };

  const setCarrierSelected = (delivery: Delivery) => {
    carrierSelected.value = delivery;
  };

  const clearSelectedAddress = () => {
    amountShipping.value = 0;
    carrierSelected.value = null;
  };

  watch(deliveriesAvailable, (newDeliveries) => {
    if (carrierSelected.value) {
      const newValue = newDeliveries.find((delivery) => delivery.id === carrierSelected.value?.id)!;

      setCarrierSelected(newValue);
      setAmountShipping(newValue.free_over ? 0 : newValue.delivery_price_rules[0].list_base_price);
    }
  });

  return {
    carriers,
    deliveriesAvailable,
    amountShipping,
    carrierSelected,

    // Getters
    isCarrierSelected: computed(() => carrierSelected.value !== null),

    // Methods
    findDeliveriesAvailable,
    setProductsIds,
    setAmountShipping,
    setCarrierSelected,
    clearSelectedAddress,
  };
});
