import { defineStore } from 'pinia';
import { useCartStore } from './cart';
import { computed, ref, watch } from 'vue';

export const useCouponStore = defineStore('coupon', () => {
  const cart = useCartStore();
  const couponInput = ref('');
  const couponValidationMessage = ref('');
  const discountPercentage = ref(0);
  const discount = ref(0);

  const validCoupons = ref([]);

  watch(discountPercentage, () => {
    discount.value = (cart.total * discountPercentage.value).toFixed(2);
  });

  function applyCoupon() {
    if (validCoupons.value.some((coupon) => coupon.name === couponInput.value)) {
      couponValidationMessage.value = 'Aplicando cupón...';

      setTimeout(() => {
        discountPercentage.value = validCoupons.value.find(
          (coupon) => coupon.name === couponInput.value,
        ).discount;
        couponValidationMessage.value = 'Cupón aplicado correctamente!';
      }, 2000);
    } else {
      couponValidationMessage.value = 'No existe el cupón ingresado.';
    }

    setTimeout(() => {
      couponValidationMessage.value = '';
    }, 5000);
  }

  function $reset() {
    couponInput.value = '';
    couponValidationMessage.value = '';
    discountPercentage.value = 0;
    discount.value = 0;
  }

  const isValidCoupon = computed(() => discountPercentage.value > 0);

  return {
    couponInput,
    couponValidationMessage,
    discount,
    isValidCoupon,

    // Methods
    applyCoupon,
    $reset,
  };
});
