<template>
  <article
    class="flex flex-col relative max-w-72 min-w-56 h-full bg-shori-gray-2 shadow-md rounded-xl cursor-pointer border border-shori-gray-6 overflow-hidden"
    @click="router.push({ name: 'product', params: { id: product ? product.id : 12345 } })"
  >
    <div
      class="aspect-[4/3] bg-shori-gray-contrast rounded-b-2xl overflow-x-hidden relative flex items-center justify-center"
    >
      <img
        v-if="product.url"
        class="h-4/5"
        :src="product.url"
        loading="lazy"
        :alt="`Imagen ${product.name}`"
      />
      <img
        v-if="product.product_galleries"
        class="h-4/5"
        :src="product.product_galleries[0]?.url"
        loading="lazy"
        :alt="`Imagen ${product.name}`"
      />
    </div>
    <div class="flex-1 flex flex-col bg-shori-gray-2 rounded-t-2xl p-2 justify-between">
      <p class="font-normal text-shori-gray-12 mb-5 flex-1">
        {{ product ? product.name : 'League Battle Deck -Charizard ex- PREVENTA' }}
      </p>

      <div class="mb-2" v-if="product.stock_visible">
        <span class="text-sm text-shori-gray-11">Disponibles: </span>
        <span class="font-semibold text-shori-green-9">{{ product.stock }}</span>
      </div>

      <div class="flex flex-col items-start relative">
        <p class="text-xl text-shori-gray-12 font-bold mt-0">
          {{ formatCurrency(product.discount ? product.discount : product.price) }}
        </p>
        <p
          v-if="product.discount"
          class="text-base text-shori-gray-11 line-through font-normal mt-0"
        >
          {{ formatCurrency(product.price) }}
        </p>
        <!-- <div
          v-if="cartAvailable"
          class="group cursor-pointer bg-gray-100 p-2 rounded-full absolute right-2 bottom-0"
        >
          <WishlistIcon class="h-6 aspect-square text-gray-500 group-hover:opacity-70" />
        </div> -->

        <button
          @click.stop="addItem(product)"
          class="text-shori-gray-contrast bg-shori-green-9 rounded w-full py-1 px-2 mt-3 mb-1 flex justify-center gap-3"
        >
          Agregar al carrito

          <CartIcon width="24" height="24" />
        </button>
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
import CartIcon from '@/modules/cart/components/CartIcon.vue';

const cart = useCartStore();

const toast: any = inject('toast');

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

const addItem = async (item: Product) => {
  if (item.stock! <= 0) {
    toast.open({
      message: 'No hay stock disponible',
      type: 'error',
    });
    return;
  }

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
