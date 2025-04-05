import { defineStore } from 'pinia';
import { computed, inject, ref } from 'vue';
import { DiscountType, type DiscountCode } from '../interfaces/discountCode.interface';
import DiscountCodeAPI from '../api/DiscountCodeAPI';
import { convertToISO, convertToYYYYMMDD } from '@/helpers/date';
import CampaignAPI from '@/modules/campaign/api/CampaignAPI';
import { useCartStore } from '@/modules/cart/stores/cart';
import { formatCurrency } from '@/helpers';

const initialValues = {
  id: 0,
  code: '',
  discount_type: DiscountType.FIXED,
  discount_value: 0,
  min_purchase: 0,
  max_discount: 0,
  usage_limit: 0,
  times_used: 0,
  expires_at: '',
};

export const useDiscountCodeStore = defineStore('discountCode', () => {
  const discountCodes = ref<DiscountCode[]>([]);
  const discountCode = ref<DiscountCode>(initialValues);

  const expires_at_ISO = ref('');

  const selectedDiscountCode = ref<DiscountCode | null>(null);

  const cartStore = useCartStore();

  const toast: any = inject('toast');

  const getDiscountCodesAll = async () => {
    try {
      const { data } = await DiscountCodeAPI.getAll();
      discountCodes.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  const createDiscountCode = async () => {
    setExpiresDate(expires_at_ISO.value);
    const { id, ...discountCodeData } = discountCode.value;

    try {
      const { data } = await DiscountCodeAPI.create(discountCodeData);

      return { msg: 'Código de descuento creado correctamente' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const setExpiresDate = (dateISO: string) => {
    const formattedDate = convertToISO(dateISO);
    discountCode.value.expires_at = formattedDate;
  };

  const cleanDiscountCode = () => {
    discountCode.value = {
      id: 0,
      code: '',
      discount_type: DiscountType.FIXED,
      discount_value: 0,
      min_purchase: 0,
      max_discount: 0,
      usage_limit: 0,
      times_used: 0,
      expires_at: '',
    };

    expires_at_ISO.value = '';
  };

  const deleteDiscountCode = async (id: number) => {
    try {
      await DiscountCodeAPI.delete(id);
      await getDiscountCodesAll();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getDiscountCodeById = async (id: number) => {
    try {
      const { data } = await DiscountCodeAPI.getById(id);
      discountCode.value = data;
      expires_at_ISO.value = convertToYYYYMMDD(discountCode.value.expires_at);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const UpdateDiscountCode = async () => {
    setExpiresDate(expires_at_ISO.value);

    const { id, ...discountCodeData } = discountCode.value;

    try {
      const { data } = await DiscountCodeAPI.update(id ?? 0, discountCodeData);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getDiscountCodeByCode = async (code: string) => {
    try {
      const { data } = await DiscountCodeAPI.getByCode(code);

      if (data.min_purchase > cartStore.subtotal) {
        throw {
          response: {
            data: {
              msg: `La compra mínima para el código es ${formatCurrency(data.min_purchase)}`,
            },
          },
        };
      }

      selectedDiscountCode.value = data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const clearSelectedDiscountCode = () => {
    selectedDiscountCode.value = null;
  };

  const updateTimesUsed = async () => {
    try {
      await DiscountCodeAPI.updateTimesUsed(selectedDiscountCode.value?.code ?? '');
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    discountCodes,
    discountCode,
    expires_at_ISO,
    selectedDiscountCode,

    // Methods
    getDiscountCodesAll,
    createDiscountCode,
    cleanDiscountCode,
    deleteDiscountCode,
    getDiscountCodeById,
    UpdateDiscountCode,
    getDiscountCodeByCode,
    clearSelectedDiscountCode,
    updateTimesUsed,

    // Getters
    isDiscountCodeSelected: computed(() => selectedDiscountCode.value !== null),
  };
});
