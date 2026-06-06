import { defineStore } from 'pinia';
import { type Delivery, DeliveryCarrierType } from '../interfaces/delivery.interface';
import { computed, ref, watch } from 'vue';
import DeliveryAPI from '../api/DeliveryAPI';
import { useAddressStore } from './address';
import { useUserStore } from '@/modules/auth/stores/user';

export const useDeliveryStore = defineStore('delivery', () => {
  const carriers = ref<Delivery[] | []>([]);
  const deliveriesAvailable = ref<Delivery[] | []>([]);
  const loading = ref(false);
  const amountShipping = ref<number>(0);
  const carrierSelected = ref<Delivery | null>(null);
  const productsIds = ref<number[]>([]);
  const deliveryType = ref<DeliveryCarrierType>(DeliveryCarrierType.DELIVERY);

  const addressStore = useAddressStore();
  const userStore = useUserStore();

  const findDeliveriesAvailable = async () => {
    carrierSelected.value = null;
    amountShipping.value = 0;

    const zipCode = addressStore.getSelectedAddress?.zip;
    const userId = userStore.user?.id;

    if (
      (deliveryType.value === DeliveryCarrierType.DELIVERY && !zipCode) ||
      (!userId && !productsIds.value.length)
    ) {
      deliveriesAvailable.value = [];
      loading.value = false;
      return;
    }

    loading.value = true;
    try {
      const { data } = await DeliveryAPI.findAvailable({
        zipCode,
        productsIds: productsIds.value,
        userId,
        deliveryType: deliveryType.value,
      });
      deliveriesAvailable.value = data.options;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  const setProductsIds = (ids: number[]) => {
    productsIds.value = [...ids];
  };

  // watch(
  //   [
  //     () => addressStore.getSelectedAddress,
  //     () => [...productsIds.value],
  //     () => userStore.user?.id,
  //     () => deliveryType.value,
  //   ],
  //   () => {
  //     console.log('Cambió alguna de las dependencias para encontrar entregas disponibles:', {
  //       selectedAddress: addressStore.getSelectedAddress,
  //       productsIds: productsIds.value,
  //       userId: userStore.user?.id,
  //       deliveryType: deliveryType.value,
  //     });
  //     findDeliveriesAvailable();
  //   },
  //   { deep: true, immediate: true },
  // );

  watch(
    () => addressStore.getSelectedAddress,
    (newAddress) => {
      findDeliveriesAvailable();
    },
    { deep: true },
  );

  watch(
    () => [...productsIds.value],
    (newProductsIds) => {
      findDeliveriesAvailable();
    },
  );

  watch(
    () => userStore.user?.id,
    (newUserId) => {
      findDeliveriesAvailable();
    },
  );

  watch(
    () => deliveryType.value,
    (newDeliveryType) => {
      findDeliveriesAvailable();
    },
  );

  const setAmountShipping = (amount: number) => {
    amountShipping.value = amount;
  };

  const setCarrierSelected = (delivery: Delivery) => {
    carrierSelected.value = delivery;
  };

  const setDeliveryType = (type: DeliveryCarrierType) => {
    deliveryType.value = type;
  };

  const clearSelectedAddress = () => {
    amountShipping.value = 0;
    carrierSelected.value = null;
  };

  // watch(deliveriesAvailable, (newDeliveries) => {
  //   if (carrierSelected.value) {
  //     const newValue = newDeliveries.find((delivery) => delivery.id === carrierSelected.value?.id)!;

  //     setCarrierSelected(newValue);
  //     setAmountShipping(newValue.amount_shipping);
  //   } else
  // });

  return {
    carriers,
    deliveriesAvailable,
    loading,
    amountShipping,
    carrierSelected,

    // Getters
    isLoading: computed(() => loading.value),
    isCarrierSelected: computed(() => carrierSelected.value !== null),
    getDeliveryType: computed(() => deliveryType.value),
    isDeliveryTypePickup: computed(() => deliveryType.value === DeliveryCarrierType.PICKUP),
    isDeliveryTypeDelivery: computed(() => deliveryType.value === DeliveryCarrierType.DELIVERY),

    // Methods
    findDeliveriesAvailable,
    setProductsIds,
    setAmountShipping,
    setCarrierSelected,
    setDeliveryType,
    clearSelectedAddress,
  };
});
