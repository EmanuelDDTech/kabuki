<template>
  <article class="flex flex-col items-center sm:flex-row gap-3 my-8">
    <div class="max-w-64 sm:max-w-40 p-3">
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
          :editable="editable"
        />
      </div>

      <div class="flex text-sm gap-6 mt-2 text-gray-500" v-if="editable">
        <p class="cursor-pointer hover:text-red-600" @click="removeItem(item.product.id)">
          Eliminar
        </p>
        <!-- <p class="cursor-pointer hover:text-blue-600">Compartir</p> -->
      </div>
    </div>
    <div class="flex items-center">
      <p class="text-xl font-bold">{{ formatCurrency(item.product.price * item.quantity) }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import Swal from 'sweetalert2';
import ProductQuantity from '@/modules/counter/components/ProductQuantity.vue';
import { formatCurrency } from '@/helpers';
import { useCartStore } from '@/modules/cart/stores/cart';

const cart = useCartStore();
const toast = inject('toast');

interface Props {
  item: Object;
  editable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
});

const res = async (productId, quantity) => {
  if (quantity <= 1) {
    toast.open({
      message: 'La cantidad mínima es 1.',
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

const removeItem = async (productId: number) => {
  Swal.fire({
    title: 'Seguro quieres eliminar este producto?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Eliminar!',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await cart.removeItem(productId);
        toast.open({
          message: 'Producto eliminado correctamente',
          type: 'success',
        });
      } catch (error) {
        toast.open({
          message: error.response.data.msg,
          type: 'error',
        });
      }
    }
  });
};
</script>

<style scoped></style>
