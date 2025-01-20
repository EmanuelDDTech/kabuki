import { defineStore } from 'pinia';
import { computed, onMounted, ref, watchEffect } from 'vue';
import CartAPI from '../api/CartAPI';

export const useCartStore = defineStore('cart', () => {
  // const coupon = useCouponStore();
  const items = ref([]);
  const subtotal = ref(0);
  const taxes = ref(0);
  const total = ref(0);

  const MAX_PRODUCTS = 10;
  const TAX_RATE = 0.1;

  const payNow = ref(false);

  watchEffect(() => {
    subtotal.value = items.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
    taxes.value = Number((subtotal.value * TAX_RATE).toFixed(2));
    total.value = Number((subtotal.value + taxes.value).toFixed(2));
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

    // if (index >= 0) {
    //   if (isProductAvailable(items.value[index])) {
    //     alert('Has alcanzado el límite');
    //     return;
    //   }

    //   items.value[index].quantity++;
    // } else {
    //   items.value.push({ ...item, quantity: 1, id: item.id });
    // }
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
    taxes.value = 0;
    total.value = 0;
  }

  function isItemInCart(id) {
    const exist = items.value.findIndex((item) => item.product.id === id);
    if (exist === -1) return false;

    return true;
  }
  const isProductAvailable = (item) =>
    item.quantity >= item.availability || item.quantity >= MAX_PRODUCTS;

  const isEmpty = computed(() => items.value.length === 0);
  const checkProductAvailability = computed(() => {
    return (item) => (item.availability < MAX_PRODUCTS ? item.availability : MAX_PRODUCTS);
  });

  return {
    subtotal,
    taxes,
    total,
    isEmpty,
    items,
    checkProductAvailability,
    payNow,

    // Methods
    getCart,
    addItem,
    removeItem,
    reduceQuantity,
    increaseQuantity,
    checkout,
    isItemInCart,
  };
});
