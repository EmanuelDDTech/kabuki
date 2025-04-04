import { defineStore } from 'pinia';
import { ref } from 'vue';
import { type DiscountCode } from '../interfaces/discountCode.interface';
import DiscountCodeAPI from '../api/DiscountCodeAPI';

export const useDiscountCodeStore = defineStore('discountCode', () => {
  const discountCodes = ref<DiscountCode[]>([]);
  const discountCode = ref<DiscountCode | null>(null);

  const getDiscountCodesAll = async () => {
    try {
      const { data } = await DiscountCodeAPI.getAll();
      discountCodes.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    discountCodes,
    discountCode,

    // Methods
    getDiscountCodesAll,
  };
});
