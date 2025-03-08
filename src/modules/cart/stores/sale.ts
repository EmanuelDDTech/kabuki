import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import SaleAPI from '../api/SaleAPI';
import type { Sale } from '../interfaces/sale.interface';

export const useSaleStore = defineStore('sale', () => {
  const myPurchases = ref<Sale[]>([]);

  const loading = ref(false);

  const getPurchases = async () => {
    loading.value = true;
    try {
      const { data } = await SaleAPI.getAll();
      myPurchases.value = data;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  const getMyPurchases = () => {
    return myPurchases.value;
  };

  const namesCombined = (sale: Sale) =>
    computed(() => {
      let names = '';
      sale.sale_carts.forEach((sale_cart) => {
        if (names === '') names += `${sale_cart.product.name}`;
        else names += ` / ${sale_cart.product.name}`;
      });

      return names;
    });

  return {
    myPurchases,

    // Methods
    getPurchases,

    // Getters
    getMyPurchases,
    isLoading: computed(() => loading.value),
    isEmpty: computed(() => myPurchases.value.length === 0),
    namesCombined,
  };
});
