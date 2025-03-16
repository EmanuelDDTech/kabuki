<script lang="ts" setup>
import { formatCurrency } from '@/helpers';
import type { Product } from '@/modules/product/interfaces/product.interface';
import { useRouter } from 'vue-router';

interface Props {
  product: Product;
}

defineProps<Props>();

const router = useRouter();
</script>

<template>
  <article
    class="flex flex-col relative max-w-72 min-w-56 h-full bg-white rounded-xl p-2 cursor-pointer hover:bg-gray-100 transition-colors"
    @click="$emit('selectProduct', product.id)"
  >
    <div
      class="aspect-[4/3] overflow-x-hidden rounded-2xl relative flex items-center justify-center"
    >
      <img
        v-if="product.product_galleries"
        class="h-4/5"
        :src="product.product_galleries[0]?.url"
        loading="lazy"
      />
    </div>
    <div class="flex-1 flex flex-col mt-4 pl-2 mb-2 justify-between">
      <p class="font-normal text-black mb-5 flex-1">
        {{ product ? product.name : 'League Battle Deck -Charizard ex- PREVENTA' }}
      </p>

      <div class="mb-2">
        <span class="text-sm text-slate-700">Disponibles: </span>
        <span class="font-semibold text-green-600">{{ product.stock }}</span>
      </div>

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
