import { defineStore } from 'pinia';
import { computed, inject, onMounted, ref, watch, watchEffect } from 'vue';
import CartAPI from '../api/CartAPI';
import SaleAPI from '../api/SaleAPI';
import { useAddressStore } from './address';
import { useDeliveryStore } from './delivery';
import { useUserStore } from '@/modules/auth/stores/user';
import ProductAPI from '@/modules/product/api/ProductAPI';
import type { Product } from '@/modules/product/interfaces/product.interface';

export const useCartStore = defineStore('cart', () => {
  // const coupon = useCouponStore();
  const items = ref([]);
  const subtotal = ref(0);
  // const taxes = ref(0);
  const total = ref(0);

  const MAX_PRODUCTS = 10;
  const TAX_RATE = 0.1;

  const payNow = ref(false);
  const paypalCart = ref([]);

  const userStore = useUserStore();
  const address = useAddressStore();
  const delivery = useDeliveryStore();

  const toast: any = inject('toast');

  watchEffect(() => {
    subtotal.value = items.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
    // taxes.value = Number((subtotal.value * TAX_RATE).toFixed(2));
    total.value = Number(subtotal.value.toFixed(2));
  });

  watchEffect(async () => {
    if (!userStore.isSet) return;
    paypalCart.value = items.value.map((item) => {
      return {
        name: item.product.name,
        unitAmount: {
          currencyCode: 'MXN',
          value: item.product.price.toString(),
        },
        quantity: item.quantity.toString(),
      };
    });
  });

  async function getCart() {
    if (userStore.isSet) {
      const { data } = await CartAPI.get();
      items.value = data;
    } else {
      const localCart = JSON.parse(localStorage.getItem('_shorikame_cart')) || [];

      Promise.all(
        localCart.map(async (localProduct: object) => {
          const { data } = await ProductAPI.findById(localProduct.id);
          const quantity = localProduct.quantity;

          return { product: data, quantity };
        }),
      ).then((results) => {
        results.forEach(({ product, quantity }) => {
          items.value.push({ id: 0, quantity, product });
        });
      });
    }
  }

  async function addItem(item) {
    if (userStore.isSet) {
      if (isItemInCart(item.id)) {
        try {
          await CartAPI.delete({ productId: item.id });
          items.value = items.value.filter((itemCart) => itemCart.product.id !== item.id);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await CartAPI.add({ productId: item.id });
          await getCart();
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      if (isItemInCart(item.id)) {
        let localCart = JSON.parse(localStorage.getItem('_shorikame_cart')) || [];
        localCart = localCart.filter((localProduct) => localProduct.id !== item.id);

        localStorage.setItem('_shorikame_cart', JSON.stringify(localCart));

        items.value = items.value.filter((itemData) => itemData.product.id !== item.id);
      } else {
        try {
          const localCart = JSON.parse(localStorage.getItem('_shorikame_cart')) || [];

          localCart.push({ id: item.id, quantity: 1 });
          localStorage.setItem('_shorikame_cart', JSON.stringify(localCart));

          const { data } = await ProductAPI.findById(item.id);

          items.value.push({ id: 0, quantity: 1, product: data });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  async function reduceQuantity(productId: number, quantity: number) {
    const newQuantity = quantity - 1;
    items.value = items.value.map((item) => {
      if (item.product.id === productId) {
        item.quantity--;
        return item;
      }
      return item;
    });

    if (userStore.isSet) {
      await CartAPI.update({ productId, quantity: newQuantity });
    } else {
      updateLocal(productId, newQuantity);
    }
  }
  async function increaseQuantity(productId: number, quantity: number) {
    try {
      const newQuantity = quantity + 1;
      items.value = items.value.map((item) => {
        if (item.product.id === productId) {
          item.quantity++;
          return item;
        }
        return item;
      });

      if (userStore.isSet) {
        await CartAPI.update({ productId, quantity: newQuantity });
      } else {
        updateLocal(productId, newQuantity);
      }
    } catch (error) {
      items.value = items.value.map((item) => {
        if (item.product.id === productId) {
          item.quantity--;
          return item;
        }
        return item;
      });

      throw error;
    }
  }

  function updateLocal(productId: number, quantity: number) {
    let localCart = JSON.parse(localStorage.getItem('_shorikame_cart')) || [];

    localCart = localCart.map((localProduct: { id: number; quantity: number }) => {
      if (localProduct.id === productId) {
        localProduct.quantity = quantity;
        return localProduct;
      }

      return localProduct;
    });

    localStorage.setItem('_shorikame_cart', JSON.stringify(localCart));
  }

  async function removeItem(productId: number) {
    if (userStore.isSet) await CartAPI.delete({ productId });
    else {
      let localCart = JSON.parse(localStorage.getItem('_shorikame_cart')) || [];
      localCart = localCart.filter(
        (locaProduct: { id: number; quantity: number }) => locaProduct.id !== productId,
      );

      localStorage.setItem('_shorikame_cart', JSON.stringify(localCart));
    }

    items.value = items.value.filter((item) => item.product.id !== productId);
  }

  async function checkout() {
    payNow.value = true;
  }

  function $reset() {
    items.value = [];
    subtotal.value = 0;
    // taxes.value = 0;
    total.value = 0;
  }

  function isItemInCart(id) {
    const exist = items.value.findIndex((item) => item.product.id === id);
    if (exist === -1) return false;

    return true;
  }

  const isEmpty = computed(() => items.value.length === 0);
  const checkProductAvailability = computed(() => {
    return (item) => (item.availability < MAX_PRODUCTS ? item.availability : MAX_PRODUCTS);
  });

  async function createSaleOrder(transaction: string) {
    const saleData = {
      state: 'sale',
      require_payment: false,
      amount_total: total.value + delivery.amountShipping,
      is_payed: true,
      invoice_required: false,
      products: getSaleProductsData(),
      address_id: address.selectedAddress,
      transaction_id: transaction,
      amount_shipping: delivery.amountShipping,
      delivery_carrier_id: delivery.carrierSelected?.id,
    };

    const { data } = await SaleAPI.create(saleData);
    payNow.value = false;
    return data;
  }

  function getSaleProductsData() {
    const productsData = items.value.map((item) => {
      const product = {
        productId: item.product.id,
        quantity: item.quantity,
        price_unit: item.product.price,
        subtotal: item.quantity * item.product.price,
      };
      return product;
    });

    return productsData;
  }

  const deleteCart = async () => {
    items.value.forEach(async (item) => {
      await CartAPI.delete({ productId: item.product.id });
    });

    items.value = [];
  };

  const moveLocalCart = async () => {
    const localCart = JSON.parse(localStorage.getItem('_shorikame_cart')) || [];

    Promise.allSettled(
      localCart.map(async (localProduct: { id: number; quantity: number }) => {
        return await CartAPI.add({ productId: localProduct.id });
      }),
    ).then((results) => {
      let error = false;
      localStorage.setItem('_shorikame_cart', JSON.stringify([]));

      console.log(results);
      results.forEach((result) => {
        if (result.status === 'rejected') error = true;
      });

      if (error) {
        toast.open({
          message: 'Algunos productos ya estaban en el carrito.',
          type: 'error',
        });
      }
    });

    await getCart();
  };

  const cartWeight = computed(() =>
    items.value.reduce((totalWeight, item) => totalWeight + item.product.weight * item.quantity, 0),
  );

  watch(items, async (newValue, oldValue) => {
    await delivery.findDeliveriesAvailable(44298, cartWeight.value);
  });

  return {
    subtotal,
    // taxes,
    total,
    isEmpty,
    items,
    checkProductAvailability,
    payNow,
    paypalCart,

    // Methods
    getCart,
    addItem,
    removeItem,
    reduceQuantity,
    increaseQuantity,
    checkout,
    isItemInCart,
    createSaleOrder,
    deleteCart,
    moveLocalCart,

    // Getters
    cartWeight,
  };
});
