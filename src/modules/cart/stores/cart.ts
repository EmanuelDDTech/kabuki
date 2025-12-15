import { defineStore } from 'pinia';
import { computed, inject, onMounted, ref, watch, watchEffect } from 'vue';
import CartAPI from '../api/CartAPI';
import SaleAPI from '../api/SaleAPI';
import { useAddressStore } from './address';
import { useDeliveryStore } from './delivery';
import { useUserStore } from '@/modules/auth/stores/user';
import ProductAPI from '@/modules/product/api/ProductAPI';
import type { Product } from '@/modules/product/interfaces/product.interface';
import { useDiscountCodeStore } from '@/modules/discountCode/stores/discountCode';
import { DiscountType } from '@/modules/discountCode/interfaces/discountCode.interface';
import { sub } from 'date-fns';

export const useCartStore = defineStore('cart', () => {
  const items = ref<{ id: number; quantity: number; product: Product }[]>([]);
  const subtotal = ref<number>(0);
  // const taxes = ref(0);
  const total = ref(0);

  const MAX_PRODUCTS = 10;
  // const TAX_RATE = 0.1;

  const payNow = ref(false);
  const paypalCart = ref([]);

  const discountAmount = ref<number>(0);

  const userStore = useUserStore();
  const address = useAddressStore();
  const delivery = useDeliveryStore();
  const discountCodeStore = useDiscountCodeStore();

  const toast: any = inject('toast');

  watchEffect(() => {
    subtotal.value = items.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
    // taxes.value = Number((subtotal.value * TAX_RATE).toFixed(2));

    if (discountCodeStore.isDiscountCodeSelected) {
      if (discountCodeStore.selectedDiscountCode?.discount_type === DiscountType.FIXED) {
        discountAmount.value = discountCodeStore.selectedDiscountCode.discount_value;
      } else if (
        discountCodeStore.selectedDiscountCode?.discount_type === DiscountType.PERCENTAGE
      ) {
        const totalDiscount =
          (subtotal.value * discountCodeStore.selectedDiscountCode.discount_value) / 100;

        discountAmount.value =
          totalDiscount < discountCodeStore.selectedDiscountCode.max_discount
            ? totalDiscount
            : discountCodeStore.selectedDiscountCode.max_discount;
      }

      if ((discountCodeStore.selectedDiscountCode?.min_purchase ?? 0) > subtotal.value) {
        toast.open({
          message: 'Compra menor al mínimo aplicable para el código',
          type: 'error',
        });
        clearDiscount();
      }
    }

    total.value = subtotal.value + delivery.amountShipping - discountAmount.value;
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
      const localCart = JSON.parse(localStorage.getItem('_shorikame_cart')!) || [];

      Promise.all(
        localCart.map(async (localProduct: object) => {
          const { data } = await ProductAPI.findById(localProduct.id);
          const quantity = localProduct.quantity;

          return { product: data, quantity };
        }),
      ).then((results) => {
        results.forEach(({ product, quantity }) => {
          if (!items.value.some((item) => item.product.id === product.id)) {
            items.value.push({ id: 0, quantity, product });
          }
        });
      });
    }
  }

  async function addItem(item: Product) {
    if (userStore.isSet) {
      // if (isItemInCart(item.id)) {
      //   try {
      //     await CartAPI.delete({ productId: item.id });
      //     items.value = items.value.filter((itemCart) => itemCart.product.id !== item.id);
      //   } catch (error) {
      //     console.log(error);
      //   }
      // } else {
      try {
        await CartAPI.add({ productId: item.id });
        await getCart();
      } catch (error) {
        console.log(error);
      }
      // }
    } else {
      if (isItemInCart(item.id)) {
        // const localCart = JSON.parse(localStorage.getItem('_shorikame_cart')!) || [];
        // const productCart = localCart.find((cart) => )
        // let localCart: any[] = JSON.parse(localStorage.getItem('_shorikame_cart')) || [];
        // localCart = localCart.filter((localProduct) => localProduct.id !== item.id);
        // localStorage.setItem('_shorikame_cart', JSON.stringify(localCart));
        // items.value = items.value.filter((itemData) => itemData.product.id !== item.id);
      } else {
        try {
          const localCart = JSON.parse(localStorage.getItem('_shorikame_cart')!) || [];

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

  async function createSaleOrder(transaction: string | null = null, paymentMethod: string | null) {
    const saleData = getSaleData(transaction, paymentMethod);

    const { data } = await SaleAPI.create(saleData);
    if (discountCodeStore.isDiscountCodeSelected) await discountCodeStore.updateTimesUsed();
    clearDiscount();
    payNow.value = false;
    return data;
  }

  function getSaleData(transaction: string | null = null, paymentMethod: string | null) {
    const saleData = {
      user_id: userStore.user?.id,
      state: transaction || paymentMethod === 'mercadopago' ? 'pendiente' : 'pago pendiente',
      require_payment: false,
      payment_method: paymentMethod,
      amount_total: total.value,
      amount_subtotal: subtotal.value,
      is_payed: true,
      invoice_required: false,
      products: getSaleProductsData(),
      address_id: address.selectedAddress,
      transaction_id: transaction,
      amount_shipping: delivery.amountShipping,
      delivery_carrier_id: delivery.carrierSelected?.id,
      discount_amount: discountAmount.value,
      discount_code_id: discountCodeStore.isDiscountCodeSelected
        ? discountCodeStore.selectedDiscountCode?.id
        : null,
    };

    return saleData;
  }

  function getSaleProductsData() {
    const productsData = items.value.map((item) => {
      const product = {
        product_id: item.product.id,
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

  const clearDiscount = () => {
    discountAmount.value = 0;
    discountCodeStore.clearSelectedDiscountCode();
  };

  const cartWeight = computed(() =>
    items.value.reduce((totalWeight, item) => totalWeight + item.product.weight * item.quantity, 0),
  );

  watch(
    items,
    async (newValue, oldValue) => {
      await delivery.findDeliveriesAvailable(44298, cartWeight.value);
    },
    { immediate: true, deep: true },
  );

  return {
    subtotal,
    // taxes,
    total,
    isEmpty,
    items,
    checkProductAvailability,
    payNow,
    paypalCart,
    discountAmount,

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
    clearDiscount,
    getSaleProductsData,
    getSaleData,

    // Getters
    cartWeight,
    cartLength: computed(() => items.value.length),
  };
});
