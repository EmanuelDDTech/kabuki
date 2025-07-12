import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import SaleAPI from '../api/SaleAPI';
import { State, type Sale } from '../interfaces/sale.interface';

export const useSaleStore = defineStore('sale', () => {
  const myPurchases = ref<Sale[]>([]);
  const purchaseInfo = ref<Sale | null>(null);
  const latestPurchases = ref<Sale[]>([]);

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

  const getPurchasesAdmin = async (query?: Record<string, string>) => {
    loading.value = true;
    try {
      const { data } = await SaleAPI.getAllAdmin(query);
      myPurchases.value = data;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  const getLatestPurchases = async (query?: Record<string, string>) => {
    loading.value = true;

    try {
      const { data } = await SaleAPI.getAllAdmin(query);
      latestPurchases.value = data;
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

  const getPurchaseInfo = () => {
    return purchaseInfo.value;
  };

  const getPurchaseById = async (id: number) => {
    const { data } = await SaleAPI.getById(id);
    purchaseInfo.value = data;
  };

  const updateState = async (state: State) => {
    const newData = { ...purchaseInfo.value };
    newData.state = state;

    try {
      await SaleAPI.update(newData.id!, newData);
    } catch (error) {
      console.log(error);
      throw error;
    }

    purchaseInfo.value = newData as Sale;
  };

  return {
    myPurchases,
    purchaseInfo,

    // Methods
    getPurchases,
    getPurchasesAdmin,
    getPurchaseById,
    updateState,
    getLatestPurchases,

    // Getters
    getMyPurchases,
    isLoading: computed(() => loading.value),
    isEmpty: computed(() => myPurchases.value.length === 0),
    namesCombined,
    getPurchaseInfo,
    address: computed(() => {
      return `${purchaseInfo.value.address.street}, ${purchaseInfo.value.address.colony}, ${purchaseInfo.value.address.city}, ${purchaseInfo.value.address.state}, ${purchaseInfo.value.address.country}`;
    }),
    latestPurchasesList: computed(() => [...latestPurchases.value]),
  };
});
