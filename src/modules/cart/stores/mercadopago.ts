import { defineStore } from 'pinia';
import { useCartStore } from './cart';
import { computed, onMounted, ref } from 'vue';
import { createPreferenceAction } from '@/modules/payments/actions';
import { useDeliveryStore } from './delivery';
import { useUserStore } from '@/modules/auth/stores/user';
import { useAddressStore } from './address';
import { processPaymentAction } from '@/modules/payments/actions/process-payment.mercadopago.action';
import { useDiscountCodeStore } from '@/modules/discountCode/stores/discountCode';

export const useMercadopagoStore = defineStore('mercadopago', () => {
  const preferenceId = ref<string | undefined>(undefined);

  const userStore = useUserStore();
  const cartStore = useCartStore();
  const deliveryStore = useDeliveryStore();
  const addressStore = useAddressStore();
  const discountStore = useDiscountCodeStore();

  const items = computed(() => {
    return cartStore.items.map((item) => {
      return {
        id: item.product.id.toString(),
        title: item.product.name,
        quantity: item.quantity,
        unit_price: Number(item.product.price),
      };
    });
  });

  const shipments = computed(() => {
    return {
      cost: deliveryStore.amountShipping,
      mode: 'not_specified',
    };
  });

  const payer = computed(() => {
    return {
      name: 'Emanuel',
    };
  });

  const backUrls = {
    success: 'https://shorikamecards.com/gracias/1?mercadopago=true',
    failure: 'https://shorikamecards.com/carrito',
    pending: 'https://shorikamecards.com/gracias/1?mercadopago=true',
  };

  const createPreference = async () => {
    const metadata = cartStore.getSaleData(null, 'mercadopago');

    try {
      const result = await createPreferenceAction({
        items: items.value,
        // mercadopagoStore.payer,
        notification_url: 'https://shorikamecards.com/mercadopago/webhook',
        back_urls: backUrls,
        shipments: shipments.value,
        metadata: metadata,
      });

      if (!result.ok) {
        preferenceId.value = undefined;
        return;
      }

      preferenceId.value = result.data;
    } catch (error) {
      console.log(error);
    }
  };

  const processPayment = async (payment_id: string) => {
    try {
      const result = await processPaymentAction(payment_id);
      console.log(result);
      cartStore.clearDiscount();
      await cartStore.deleteCart();
      addressStore.clearSelectedAddress();
      deliveryStore.clearSelectedAddress();
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  // onMounted(async () => {
  //   await createPreference();
  // });

  return {
    preferenceId,

    // Methods
    createPreference,
    processPayment,
  };
});
