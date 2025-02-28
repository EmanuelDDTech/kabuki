import { defineStore } from 'pinia';
import type { Delivery } from '../interfaces/delivery.interface';
import { computed, ref } from 'vue';
import DeliveryAPI from '../api/DeliveryAPI';

export const useDeliveryStore = defineStore('delivery', () => {
  const carriers = ref<Delivery[] | []>([]);
  const deliveriesAvailable = ref<Delivery[] | []>([]);
  const amountShipping = ref(0);
  const carrierSelected = ref<Delivery | null>(null);
  const panel_cp = ref(true);

  const findDeliveriesAvailable = async (zipCode: number, cartWeight: number) => {
    try {
      const { data } = await DeliveryAPI.findAvailable(cartWeight, zipCode);

      deliveriesAvailable.value = data;
    } catch (error) {
      console.log(error);
    }
  };

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

  return {
    carriers,
    deliveriesAvailable,
    amountShipping,
    carrierSelected,

    // Getters
    isCarrierSelected: computed(() => carrierSelected.value !== null),

    // Methods
    findDeliveriesAvailable,
    setAmountShipping,
    setCarrierSelected,
    clearSelectedAddress,
  };
});
