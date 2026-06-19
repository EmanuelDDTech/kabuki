<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useSeoMeta } from '@unhead/vue';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { A11y, FreeMode, Keyboard, Thumbs } from 'swiper/modules';
import WishlistIcon from '@/modules/cart/components/wishlistIcon.vue';
import ShareIcon from '../components/ShareIcon.vue';
import type { Swiper as SwiperInstance } from 'swiper/types';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/modules/product/stores/product';
import { formatCurrency } from '@/helpers';
import { useCartStore } from '@/modules/cart/stores/cart';
import GeneralButton from '@/modules/common/components/GeneralButton.vue';
import CartIcon from '@/modules/cart/components/CartIcon.vue';
import type { Product } from '@/modules/product/interfaces/product.interface';

// const thumbsSwiper = ref<SwiperClass | null>(null);

const modules = [Thumbs, Keyboard, A11y];
const thumbsModules = [Thumbs, FreeMode];
const thumbsSwiper = ref<SwiperInstance | null>(null);

const thumbsControl = computed(() => {
  return thumbsSwiper.value && !thumbsSwiper.value.destroyed ? thumbsSwiper.value : null;
});

const setThumbsSwiper = (s: SwiperInstance) => {
  thumbsSwiper.value = s;
};

const product = useProductStore();
const cart = useCartStore();

const route = useRoute();

const toast: any = inject('toast');

const shareUrl = computed(() => {
  if (typeof window === 'undefined') {
    return `https://shorikamecards.com${route.fullPath}`;
  }

  return `${window.location.origin}${route.fullPath}`;
});

useSeoMeta({
  title: () => product.name || 'Cargando... ',
  ogTitle: () => product.name || 'Cargando...',
  description: () => (product.name ? `Compra ${product.name} al mejor precio.` : 'Cargando...'),
  ogDescription: () => (product.name ? `Compra ${product.name} al mejor precio.` : 'Cargando...'),
  ogImage: () => product.gallery[0]?.url,
  ogImageHeight: '1000',
  ogImageWidth: '1000',
  ogImageType: 'image/png',
  ogUrl: `https://shorikamecards.com${route.fullPath}`,
});

onMounted(async () => {
  await product.findProduct(route.params.id);
  await nextTick();

  const descripcionContainer = document.querySelector('#description-container');
  if (descripcionContainer && product.description) {
    const productDescription = document.createElement('div');
    productDescription.innerHTML = product.description;
    descripcionContainer.appendChild(productDescription);
  }
});

const loadedImages = reactive(new Set<number>());

function markImageLoaded(id: number) {
  loadedImages.add(id);
}

onUnmounted(() => {
  product.cleanProduct();
});

const addItem = async () => {
  try {
    await cart.addItem(product as unknown as Product);
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

const copyShareUrl = async () => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(shareUrl.value);
    return true;
  }

  const textArea = document.createElement('textarea');
  textArea.value = shareUrl.value;
  textArea.setAttribute('readonly', 'true');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  textArea.style.pointerEvents = 'none';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textArea);

  return copied;
};

const shareItem = async () => {
  if (!product.name) return;

  const shareData: ShareData = {
    title: product.name,
    text: `Mira este producto: ${product.name}`,
    url: shareUrl.value,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    const copied = await copyShareUrl();
    toast?.open({
      message: copied ? 'Enlace copiado al portapapeles' : 'No se pudo copiar el enlace',
      type: copied ? 'success' : 'error',
    });
  } catch (error) {
    toast?.open({
      message: 'No se pudo compartir el producto',
      type: 'error',
    });
  }
};
</script>

<template>
  <main class="px-6">
    <section class="max-w-screen-xl mx-auto grid gap-8 md:grid-cols-2 lg:gap-12">
      <div class="mx-auto flex w-full min-w-0 max-w-sm flex-col gap-3 sm:max-w-md md:max-w-none">
        <template v-if="product.isLoading">
          <div
            class="aspect-square overflow-hidden rounded-2xl border-2 border-shori-gray-6 bg-shori-gray-3 animate-pulse"
            aria-hidden="true"
          />
          <div class="grid grid-cols-4 gap-3 sm:gap-4" aria-hidden="true">
            <div
              v-for="thumb in 4"
              :key="thumb"
              class="h-16 rounded-xl border-2 border-shori-gray-6 bg-shori-gray-3 animate-pulse sm:h-20"
            />
          </div>
        </template>
        <template v-else>
          <div
            class="aspect-square overflow-hidden rounded-2xl bg-shori-gray-contrast border-2 border-shori-gray-6"
          >
            <swiper
              v-if="product.gallery.length > 0"
              :key="product.gallery[0].id"
              :modules="modules"
              :thumbs="{ swiper: thumbsControl }"
              :keyboard="{ enabled: true }"
              :a11y="{ enabled: true }"
              :slides-per-view="1"
              :spaceBetween="0"
              class="product-gallery h-full w-full"
            >
              <swiper-slide
                v-for="(image, i) in product.gallery"
                :key="image.id"
                class="sm:p-10 cursor-grab"
              >
                <!-- <img :src="image.url" class="w-4/5"/> -->

                <div class="relative h-full w-full">
                  <div
                    v-show="!loadedImages.has(image.id)"
                    class="absolute inset-0 animate-pulse bg-shori-gray-2"
                    aria-hidden="true"
                  />
                  <img
                    :src="image.url"
                    :alt="'Imagen de ' + product.name"
                    class="h-full w-full object-cover transition-opacity duration-500 ease-out"
                    :class="loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'"
                    :loading="i === 0 ? 'eager' : 'lazy'"
                    :fetchpriority="i === 0 ? 'high' : 'auto'"
                    decoding="async"
                    draggable="false"
                    @load="markImageLoaded(image.id)"
                    @error="markImageLoaded(image.id)"
                  />
                </div>
              </swiper-slide>
            </swiper>
            <div v-else class="grid h-full place-items-center text-muted">Sin imagen</div>
          </div>
          <swiper
            v-if="product.gallery.length > 0"
            :key="`thumbs-${product.id}`"
            :modules="thumbsModules"
            :slides-per-view="'auto'"
            :space-between="12"
            :watch-slides-progress="true"
            :free-mode="true"
            class="product-thumbs w-full"
            @swiper="setThumbsSwiper"
          >
            <swiper-slide v-for="image in product.gallery" :key="image.id" class="!w-16 sm:!w-20">
              <!-- <img :src="image.url" class="w-4/5"/> -->

              <div
                class="product-thumb-container relative h-16 w-16 cursor-pointer overflow-hidden rounded-xl border-2 border-shori-gray-6 transition-colors sm:h-20 sm:w-20"
                role="button"
                tabindex="0"
              >
                <div
                  v-show="!loadedImages.has(image.id)"
                  class="absolute inset-0 animate-pulse bg-shori-gray-contrast"
                  aria-hidden="true"
                />
                <img
                  :src="image.url"
                  :alt="`Imagen de ${product.name}`"
                  class="h-full w-full object-cover transition-opacity duration-300 ease-out"
                  :class="loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  @load="markImageLoaded(image.id)"
                  @error="markImageLoaded(image.id)"
                />
              </div>
            </swiper-slide>
          </swiper>
        </template>
      </div>

      <div class="w-full flex flex-col gap-6">
        <template v-if="product.isLoading">
          <div class="space-y-8" aria-hidden="true">
            <div class="h-10 w-4/5 rounded-lg bg-shori-gray-3 animate-pulse" />

            <div class="space-y-3">
              <div class="h-9 w-36 rounded-lg bg-shori-gray-3 animate-pulse" />
              <div class="flex items-end gap-3">
                <div class="h-6 w-24 rounded-md bg-shori-gray-3 animate-pulse" />
                <div class="h-6 w-16 rounded-md bg-shori-gray-3 animate-pulse" />
              </div>
            </div>

            <div class="h-12 w-full rounded-lg bg-shori-gray-3 animate-pulse" />

            <div class="flex items-center justify-center gap-4">
              <div class="h-6 w-24 rounded-md bg-shori-gray-3 animate-pulse" />
              <div class="h-6 w-24 rounded-md bg-shori-gray-3 animate-pulse" />
            </div>

            <div class="space-y-4">
              <div class="h-8 w-52 rounded-lg bg-shori-gray-3 animate-pulse" />
              <div class="space-y-2">
                <div
                  v-for="line in 5"
                  :key="line"
                  class="h-4 rounded bg-shori-gray-3 animate-pulse"
                  :class="line === 5 ? 'w-2/3' : 'w-full'"
                />
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div>
            <h1 class="text-title-3 font-semibold mb-3">{{ product.name }}</h1>

            <p
              v-if="product.discount"
              class="inline-flex w-fit items-center rounded-full border border-shori-green-6 bg-shori-green-2 px-3 py-1 text-body-small font-semibold tracking-wide text-shori-green-12 shadow-sm"
            >
              -{{ product.discountPercentage }}%
            </p>

            <div class="mt-8 flex items-center gap-6">
              <p class="text-title-4 font-bold">
                {{ formatCurrency(product.discount ? product.discount : product.price) }}
              </p>
              <div v-if="product.discount" class="flex gap-3 items-end">
                <p class="text-title-5 text-shori-gray-11 line-through font-normal mt-0">
                  {{ formatCurrency(product.price) }}
                </p>
              </div>
            </div>
          </div>

          <div
            id="description-container"
            class="text-shori-gray-11 text-body-normal whitespace-pre-wrap mt-6 mb-8"
          >
            <h2 class="mb-3">Contenido del producto:</h2>
          </div>

          <div>
            <GeneralButton
              @click="addItem"
              text="Agregar al carrito"
              size="large"
              width="full"
              :icon="CartIcon"
            />
          </div>

          <div class="flex pl-4 font-normal justify-center">
            <RouterLink
              :to="{ name: 'home' }"
              class="flex items-center gap-2 pr-4 border-r-2 border-shori-gray-6 hover:text-red-500 transition-colors"
            >
              <WishlistIcon class="h-6 aspect-square font-normal" />
              Favoritos</RouterLink
            >
            <button
              class="flex items-center gap-2 rounded-xl px-4 py-3 pl-4 hover:text-blue-500 transition-colors"
              @click="shareItem"
            >
              <ShareIcon class="h-6 aspect-square font-normal" />
              Compartir
            </button>
          </div>
        </template>
      </div>
    </section>
    <!-- <section class="max-w-screen-xl mx-auto mb-10"></section> -->
  </main>
</template>

<style lang="postcss">
/* .mySwiper2 .swiper-slide {
  @apply flex justify-center items-center;
}

.mySwiper .swiper-slide {
  @apply flex justify-center items-center aspect-square w-28 max-h-28;
}*/

.product-thumbs .swiper-slide.swiper-slide-thumb-active .product-thumb-container {
  @apply border-shori-green-9;
}
.product-gallery .swiper-slide {
  height: auto;
}

#description-container ul {
  @apply pl-4 list-disc;
}

#description-container h3 {
  @apply text-lg font-semibold mb-2;
}
</style>
