import { defineStore } from 'pinia';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import CartAPI from '../api/CartAPI';
import SaleAPI from '../api/SaleAPI';
import { useAddressStore } from './address';
import { useDeliveryStore } from './delivery';

const address = useAddressStore();
const delivery = useDeliveryStore();

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

  watchEffect(() => {
    subtotal.value = items.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
    // taxes.value = Number((subtotal.value * TAX_RATE).toFixed(2));
    total.value = Number(subtotal.value.toFixed(2));
  });

  watchEffect(() => {
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

  onMounted(() => {
    getCart();
  });

  async function getCart() {
    const { data } = await CartAPI.get();
    items.value = data;
  }

  async function addItem(item) {
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
  }

  async function reduceQuantity(productId, quantity) {
    const newQuantity = quantity - 1;
    items.value = items.value.map((item) => {
      if (item.product.id === productId) {
        item.quantity--;
        return item;
      }
      return item;
    });

    await CartAPI.update({ productId, quantity: newQuantity });
  }
  async function increaseQuantity(productId, quantity) {
    try {
      const newQuantity = quantity + 1;
      items.value = items.value.map((item) => {
        if (item.product.id === productId) {
          item.quantity++;
          return item;
        }
        return item;
      });

      await CartAPI.update({ productId, quantity: newQuantity });
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

  async function removeItem(productId: number) {
    await CartAPI.delete({ productId });
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
  // const isProductAvailable = (item) =>
  //   item.quantity >= item.availability || item.quantity >= MAX_PRODUCTS;

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
  };
});
