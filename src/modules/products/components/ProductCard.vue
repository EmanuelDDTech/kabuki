<template>
  <article
    class="flex flex-col relative max-w-72 min-w-56 bg-white shadow-md rounded-3xl p-2 cursor-pointer border border-gray-100"
    @click="router.push({ name: 'product', params: { id: product ? product.id : 12345 } })"
  >
    <div
      class="aspect-[4/3] overflow-x-hidden rounded-2xl relative flex items-center justify-center"
    >
      <img v-if="product.url" class="h-4/5" :src="product.url" />
      <img
        v-if="product.product_galleries"
        class="h-4/5"
        :src="product.product_galleries[0]?.url"
      />
      <p
        v-if="cartAvailable"
        @click.stop="addItem(product)"
        class="absolute right-2 top-2 rounded-full p-2 cursor-pointer group"
        :class="
          cart.isItemInCart(product ? product.id : defaultProduct.id)
            ? 'text-white bg-yellow-400'
            : 'text-gray-500 bg-gray-100'
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 aspect-square group-hover:opacity-70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </p>
    </div>
    <div class="flex-1 flex flex-col mt-4 pl-2 mb-2 justify-between">
      <p class="font-normal text-black mb-5">
        {{ product ? product.name : 'League Battle Deck -Charizard ex- PREVENTA' }}
      </p>
      <div class="flex flex-col items-start relative">
        <!-- <p class="text-xl text-black font-bold mt-0">
          {{ product.discount ? formatCurrency(product.discount) : formatCurrency(product.price) }}
        </p>
        <p v-if="product.discount" class="text-base text-gray-500 line-through font-normal mt-0">
          {{ formatCurrency(product.price) }}
        </p> -->

        <p class="text-xl text-black font-bold mt-0">
          {{ formatCurrency(product.discount ? product.discount : product.price) }}
        </p>
        <p v-if="product.discount" class="text-base text-gray-500 line-through font-normal mt-0">
          {{ formatCurrency(product.price) }}
        </p>
        <!-- <div
          v-if="cartAvailable"
          class="group cursor-pointer bg-gray-100 p-2 rounded-full absolute right-2 bottom-0"
        >
          <WishlistIcon class="h-6 aspect-square text-gray-500 group-hover:opacity-70" />
        </div> -->
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import WishlistIcon from '@/modules/cart/components/wishlistIcon.vue';
import { useRouter } from 'vue-router';
import { formatCurrency } from '@/helpers';
import { useCartStore } from '@/modules/cart/stores/cart';
import { inject } from 'vue';
import type { Product } from '@/modules/product/interfaces/product.interface';

const cart = useCartStore();

const toast = inject('toast');

interface Props {
  product: Product;
  cartAvailable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  cartAvailable: true,
});

const defaultProduct = {
  url: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F04da6c7dd79.jpg?alt=media&token=a77642f5-7194-4256-b4cd-bc6dfef5b897',
  id: 1,
  price: 100,
};

const router = useRouter();

const addItem = async (item) => {
  try {
    await cart.addItem(item);
    toast.open({
      message: 'Carrito actualizado correctamente',
      type: 'success',
    });
  } catch (error) {
    toast.open({
      message: 'Error al actualizar el carrito',
      type: 'error',
    });
  }
};
</script>
