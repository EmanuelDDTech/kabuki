<script setup lang="ts">
import SwiperSlider from '@/modules/slider/components/SwiperSlider.vue';
import MainBanner from '../components/MainBanner.vue';
import NavBar from '../components/NavBar.vue';
import LightingIcon from '@/modules/icons/LightingIcon.vue';
import DiscountIcon from '@/modules/icons/DiscountIcon.vue';
import ClosedBoxIcon from '../components/ClosedBoxIcon.vue';
import { useCampaignStore } from '@/modules/campaign/stores/campaign';
import { onBeforeMount, onMounted } from 'vue';
import { converToDDMMYYYY, displayDate } from '@/helpers/date';
import { date } from '@vueform/vueform';
import StarIcon from '@/modules/common/icons/StarIcon.vue';
import { useFeaturedProductStore } from '../stores/featuredProduct';
import ProductCard from '@/modules/products/components/ProductCard.vue';

const campaign = useCampaignStore();
const featuredProductStore = useFeaturedProductStore();

const routes = [
  {
    name: 'products',
    text: 'Surgin Sparks',
    img: 'surgin_sparks.jpg',
    query: { expansion: 'surgin-sparks' },
  },
  {
    name: 'products',
    text: 'Stellar Crown',
    img: 'stellar_crown.jpg',
    query: { expansion: 'stellar-crown' },
  },
  {
    name: 'products',
    text: 'Shrouded Fable',
    img: 'shrouded_fable.jpg',
    query: { expansion: 'shrouded-fable' },
  },
  {
    name: 'products',
    text: 'Twilight Masquerade',
    img: 'twilight_masquerade.jpg',
    query: { expansion: 'twilight-masquerade' },
  },
  {
    name: 'products',
    text: 'Temporal Forces',
    img: 'temporal_forces.jpg',
    query: { expansion: 'temporal-forces' },
  },
  {
    name: 'products',
    text: 'Paldean Fates',
    img: 'paldean_fate.jpg',
    query: { expansion: 'paldean-fates' },
  },
  {
    name: 'products',
    text: 'Paradox Rift',
    img: 'paradox_rift.jpg',
    query: { expansion: 'paradox-rift' },
  },
  {
    name: 'products',
    text: 'Obsidian Flames',
    img: 'obsidian_flames.jpg',
    query: { expansion: 'obsidian-flames' },
  },
  {
    name: 'products',
    text: 'Paldea Evolved',
    img: 'paldea_evolve.jpg',
    query: { expansion: 'paldea-evolved' },
  },
  {
    name: 'products',
    text: 'Scarlet & Violet',
    img: 'scarlet_violet.jpg',
    query: { expansion: 'scarlet-&-violet' },
  },
];

const campaignTypes = {
  Preventa: LightingIcon,
  Oferta: DiscountIcon,
};

onBeforeMount(async () => {
  await campaign.getCampaignsAll();
});

onMounted(async () => {
  await featuredProductStore.getFeaturedProducts();
});
</script>

<template>
  <main>
    <MainBanner />
    <NavBar :routes="routes" />
    <section class="px-3">
      <div
        class="max-w-screen-xl mx-auto py-14"
        v-for="campaignData in campaign.campaigns"
        :key="campaignData.id"
      >
        <SwiperSlider
          :title="`${campaignData.campaign_type.name} ${campaignData.name}`"
          :countdown="campaignData.campaign_type.name === 'Preventa' ? true : false"
          :finish-date="campaignData.to"
          :icon="campaignTypes[campaignData.campaign_type.name]"
          :campaign-products="campaignData.campaign_products"
        />
      </div>
    </section>

    <section class="px-3">
      <div class="max-w-screen-xl mx-auto py-14">
        <div class="flex gap-3 order-2 sm:order-1 mb-8">
          <StarIcon class="w-9 h-9 text-white bg-black p-2 rounded-full" />
          <h2 class="text-4xl font-bold">Producto destacado</h2>
        </div>

        <div class="grid gap-5 grid-cols-[repeat(auto-fill,minmax(224px,288px))] justify-center">
          <ProductCard
            v-for="featuredProduct in featuredProductStore.featuredProducts"
            :key="featuredProduct.product.id"
            :product="featuredProduct.product"
          />
        </div>
      </div>
    </section>

    <section class="px-3">
      <div class="max-w-screen-xl mx-auto py-8">
        <header class="flex gap-3 mb-6">
          <ClosedBoxIcon class="w-9 aspect-square text-white bg-black p-2 rounded-full" />
          <h2 class="text-4xl font-bold">Producto cerrado</h2>
        </header>
        <div class="block lg:flex gap-6">
          <aside
            class="aspect-video lg:aspect-9/16 lg:min-h-full min-w-80 w-auto border border-gray-100 bg-gray-50 rounded-lg shadow-lg"
          ></aside>
          <ul class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <li class="shadow-lg p-6 rounded-lg border border-gray-100 aspect-video">
              <h3 class="text-xl font-bold">Booster Box</h3>
              <p class="text-gray-400 mb-3">"Más cartas, más poder."</p>
              <div class="flex gap-3">
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
              </div>
            </li>
            <li class="shadow-lg p-6 rounded-lg border border-gray-100 aspect-video">
              <h3 class="text-xl font-bold">Elite Trainer Box</h3>
              <p class="text-gray-400 mb-3">"Todo lo que necesitas."</p>
              <div class="flex gap-3">
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
              </div>
            </li>
            <li class="shadow-lg p-6 rounded-lg border border-gray-100 aspect-video">
              <h3 class="text-xl font-bold">Premium Collection</h3>
              <p class="text-gray-400 mb-3">"Exclusividad garantizada."</p>
              <div class="flex gap-3">
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
              </div>
            </li>
            <li class="shadow-lg p-6 rounded-lg border border-gray-100 aspect-video">
              <h3 class="text-xl font-bold">Special Collection</h3>
              <p class="text-gray-400 mb-3">"Ediciones únicas."</p>
              <div class="flex gap-3">
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
                <article class="flex flex-col gap-2 justify-center items-center">
                  <img src="@assets/img/producto.webp" alt="" class="object-contain w-3/5" />
                  <p class="font-bold">$2,500.00</p>
                </article>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>
