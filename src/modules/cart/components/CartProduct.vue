<template>
  <article class="flex gap-3 my-8">
    <div class="w-40 p-3">
      <img :src="item.product.product_galleries[0].url" alt="Imagen de producto" class="w-full" />
    </div>
    <div class="flex-1 flex flex-col justify-center">
      <h3 class="text-xl">{{ item.product.name }}</h3>

      <div class="mt-2 flex gap-3">
        <p class="font-bold">Precio unitario:</p>
        <p>{{ formatCurrency(item.product.price) }}</p>
      </div>

      <div class="mt-2 flex gap-3 items-center">
        <p class="font-bold">Cantidad:</p>
        <ProductQuantity
          :value="item.quantity"
          @res="res(item.product.id, item.quantity, item.product.stock)"
          @sum="sum(item.product.id, item.quantity, item.product.stock)"
        />
      </div>

      <div class="flex text-sm gap-6 mt-2 text-gray-500">
        <p class="cursor-pointer hover:text-red-600">Eliminar</p>
        <p class="cursor-pointer hover:text-blue-600">Compartir</p>
      </div>
    </div>
    <div class="flex items-center">
      <p class="text-xl font-bold">{{ formatCurrency(item.product.price * item.quantity) }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import ProductQuantity from '@/modules/counter/components/ProductQuantity.vue';
import { formatCurrency } from '@/helpers';
import { useCartStore } from '@/modules/cart/stores/cart';

const cart = useCartStore();
const toast = inject('toast');

interface Props {
  item?: Object;
}

const props = defineProps<Props>();

const res = async (productId, quantity) => {
  if (quantity <= 0) {
    toast.open({
      message: 'La cantidad ya está en 0',
      type: 'error',
    });
    return;
  }

  try {
    await cart.reduceQuantity(productId, quantity);
    toast.open({
      message: 'Cantidad actualizada correctamente',
      type: 'success',
    });
  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};

const sum = async (productId, quantity, stock) => {
  if (quantity >= stock) {
    toast.open({
      message: 'No hay más stock disponible',
      type: 'error',
    });
    return;
  }

  try {
    await cart.increaseQuantity(productId, quantity);
    toast.open({
      message: 'Cantidad actualizada correctamente',
      type: 'success',
    });
  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};
</script>

<style scoped></style>
