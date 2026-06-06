<template>
  <article
    class="grid grid-cols-[88px_1fr] md:grid-cols-[116px_1fr_auto] gap-[1.1rem] items-center rounded-3xl border border-[color-mix(in_srgb,var(--gray-6)_82%,transparent)] bg-[color-mix(in_srgb,var(--gray-1)_88%,var(--gray-2))] p-4 my-4 shadow-[0_14px_30px_rgba(18,26,41,0.06)]"
  >
    <div
      class="aspect-square rounded-2xl bg-[radial-gradient(circle_at_24%_10%,color-mix(in_srgb,var(--green-3)_70%,transparent),transparent_55%),color-mix(in_srgb,var(--gray-2)_86%,var(--gray-1))] flex justify-center items-center p-[0.65rem]"
    >
      <img
        :src="item.product.product_galleries[0].url"
        alt="Imagen de producto"
        class="w-full h-full object-contain"
      />
    </div>

    <div class="min-w-0">
      <h3 class="text-[1.24rem] leading-[1.2] font-semibold text-shori-gray-12 mb-3">
        {{ item.product.name }}
      </h3>

      <div class="flex items-center gap-4 mt-2">
        <p class="text-[0.92rem] font-semibold text-shori-gray-11">Precio unitario</p>
        <p class="text-[0.95rem] text-shori-gray-12">{{ formatCurrency(item.product.price) }}</p>
      </div>

      <div class="flex items-center gap-4 mt-2">
        <p class="text-[0.92rem] font-semibold text-shori-gray-11">Cantidad</p>
        <ProductQuantity
          :value="item.quantity"
          @res="res(item.product.id, item.quantity)"
          @sum="sum(item.product.id, item.quantity, item.product.stock ?? 0)"
          :editable="editable"
        />
      </div>

      <button
        v-if="editable"
        class="mt-2 text-shori-gray-11 text-[0.86rem] font-semibold"
        @click="removeItem(item.product.id)"
      >
        Eliminar
      </button>
    </div>

    <div class="justify-self-start md:justify-self-end col-span-2 md:col-span-1 mt-1 md:mt-0">
      <p class="text-[1.55rem] md:text-[2rem] font-bold text-shori-gray-12 tracking-[-0.02em]">
        {{ formatCurrency(item.product.price * item.quantity) }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import Swal from 'sweetalert2';
import ProductQuantity from '@/modules/counter/components/ProductQuantity.vue';
import { formatCurrency } from '@/helpers';
import { useCartStore } from '@/modules/cart/stores/cart';
import type { Product } from '@/modules/product/interfaces/product.interface';

const cart = useCartStore();
const toast: any = inject('toast');

interface CartItem {
  id?: number;
  quantity: number;
  product: Product;
}

interface Props {
  item: CartItem;
  editable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
});

const res = async (productId: number, quantity: number) => {
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
  } catch (error: any) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};

const sum = async (productId: number, quantity: number, stock: number) => {
  if (stock <= 0 || quantity >= stock) {
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
  } catch (error: any) {
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
    confirmButtonColor: 'var(--green-9)',
    cancelButtonColor: 'var(--gray-9)',
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
      } catch (error: any) {
        toast.open({
          message: error.response.data.msg,
          type: 'error',
        });
      }
    }
  });
};
</script>
