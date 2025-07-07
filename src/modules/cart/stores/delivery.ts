import { defineStore } from 'pinia';
import type { Delivery } from '../interfaces/delivery.interface';
import { computed, ref, watch } from 'vue';
import DeliveryAPI from '../api/DeliveryAPI';

export const useDeliveryStore = defineStore('delivery', () => {
  const carriers = ref<Delivery[] | []>([]);
  const deliveriesAvailable = ref<Delivery[] | []>([]);
  const amountShipping = ref<number>(0);
  const carrierSelected = ref<Delivery | null>(null);
  const panel_cp = ref(true);

  const findDeliveriesAvailable = async (zipCode: number, cartWeight: number) => {
    if (cartWeight <= 0) return;
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

  watch(deliveriesAvailable, (newDeliveries, oldDeliveries) => {
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
    setAmountShipping,
    setCarrierSelected,
    clearSelectedAddress,
  };
});
