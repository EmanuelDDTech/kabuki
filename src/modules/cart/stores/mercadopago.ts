import { defineStore } from 'pinia';
import { useCartStore } from './cart';
import { computed, onMounted, ref } from 'vue';
import { createPreferenceAction } from '@/modules/payments/actions';

export const useMercadopagoStore = defineStore('mercadopago', () => {
  const preferenceId = ref<string | undefined>(undefined);

  const cartStore = useCartStore();

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

  const payer = computed(() => {
    return {
      name: 'Emanuel',
    };
  });

  const backUrls = {
    success: 'https://shorikamecards.com/gracias/1',
    failure: 'https://shorikamecards.com/carrito',
    pending: 'https://shorikamecards.com/gracias/1',
  };

  const createPreference = async () => {
    try {
      const result = await createPreferenceAction({
        items: items.value,
        // mercadopagoStore.payer,
        notification_url: 'https://shorikamecards.com/mercadopago/webhook',
        back_urls: backUrls,
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

  // onMounted(async () => {
  //   await createPreference();
  // });

  return {
    preferenceId,

    // Methods
    createPreference,
  };
});
