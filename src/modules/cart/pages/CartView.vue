<script setup lang="ts">
import { useProductsCategory } from '@/composables/useProductsCategory';
import CartProduct from '../components/CartProduct.vue';
import SideBard from '../components/SideBard.vue';
import { useCartStore } from '../stores/cart';

const cart = useCartStore();
const { currentProductsCategory } = useProductsCategory();
</script>

<template>
  <main class="cart-page min-h-screen px-3 pb-10 pt-6">
    <div class="max-w-screen-xl mx-auto block lg:flex gap-8 xl:gap-10 mt-4">
      <div class="flex-1 min-w-0">
        <section
          v-if="cart.isEmpty"
          class="rounded-[30px] border p-7 [border-color:color-mix(in_srgb,var(--gray-6)_80%,transparent)] [background:linear-gradient(155deg,color-mix(in_srgb,var(--gray-1)_86%,var(--gray-2)),color-mix(in_srgb,var(--gray-1)_92%,var(--gray-2)))] [box-shadow:0_30px_62px_rgba(17,33,61,0.09),0_10px_20px_rgba(17,33,61,0.04)]"
        >
          <h2 class="mt-[0.2rem] text-[clamp(1.65rem,2.8vw,2.3rem)] font-bold text-shori-gray-12">
            Carrito
          </h2>
          <p class="mt-6 text-shori-gray-11 text-[1.04rem]">
            No hay productos en el carrito.
            <router-link
              class="ml-1 text-shori-green-11 font-semibold"
              :to="{ name: 'products', params: { category: currentProductsCategory } }"
            >
              Ver productos
            </router-link>
          </p>
        </section>

        <section
          v-else
          class="rounded-[30px] border p-6 md:p-7 [border-color:color-mix(in_srgb,var(--gray-6)_80%,transparent)] [background:linear-gradient(155deg,color-mix(in_srgb,var(--gray-1)_86%,var(--gray-2)),color-mix(in_srgb,var(--gray-1)_92%,var(--gray-2)))] [box-shadow:0_30px_62px_rgba(17,33,61,0.09),0_10px_20px_rgba(17,33,61,0.04)]"
        >
          <header
            class="flex justify-between items-end pb-4 border-b [border-color:color-mix(in_srgb,var(--gray-6)_82%,transparent)]"
          >
            <div>
              <p class="text-[0.72rem] uppercase tracking-[0.1em] text-shori-gray-10 font-bold">
                Checkout
              </p>
              <h2
                class="mt-[0.2rem] text-[clamp(1.65rem,2.8vw,2.3rem)] font-bold text-shori-gray-12"
              >
                Carrito
              </h2>
            </div>
            <p class="text-[0.9rem] font-semibold text-shori-gray-10">
              {{ cart.cartLength }} {{ cart.cartLength === 1 ? 'artículo' : 'artículos' }}
            </p>
          </header>

          <CartProduct v-for="item in cart.items" :key="item.product.id" :item="item" />
        </section>
      </div>

      <SideBard checkout-step="cart" />
    </div>
  </main>
</template>
