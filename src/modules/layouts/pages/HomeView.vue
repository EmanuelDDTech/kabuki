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
import ProductSkeleton from '@/modules/products/components/ProductSkeleton.vue';

const campaign = useCampaignStore();
const featuredProductStore = useFeaturedProductStore();

const routes = [
  {
    name: 'products',
    text: 'Surgin Sparks',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fsurgin_sparks.webp?alt=media&token=07ee7fe9-2e9d-4d20-9440-6b14d88e3ddc',
    query: { expansion: 'surgin-sparks' },
  },
  {
    name: 'products',
    text: 'Stellar Crown',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fstellar_crown.webp?alt=media&token=9292a456-67b8-4391-ae85-d3278ccb7531',
    query: { expansion: 'stellar-crown' },
  },
  {
    name: 'products',
    text: 'Shrouded Fable',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fshrouded_fable.webp?alt=media&token=04344873-eb4c-49aa-b040-ef31807628aa',
    query: { expansion: 'shrouded-fable' },
  },
  {
    name: 'products',
    text: 'Twilight Masquerade',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Ftwilight_masquerade.webp?alt=media&token=6ea2c443-b0ee-46f6-90ca-9edfd16058ec',
    query: { expansion: 'twilight-masquerade' },
  },
  {
    name: 'products',
    text: 'Temporal Forces',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Ftemporal_forces.webp?alt=media&token=15830a31-4e19-40fa-8362-15dea4d2043f',
    query: { expansion: 'temporal-forces' },
  },
  {
    name: 'products',
    text: 'Paldean Fates',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fpaldean_fate.webp?alt=media&token=06d8bea9-baab-45e6-80e5-27a07204490d',
    query: { expansion: 'paldean-fates' },
  },
  {
    name: 'products',
    text: 'Paradox Rift',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fparadox_rift.webp?alt=media&token=e9b51d4f-e5f5-4a12-963c-db201b4b9625',
    query: { expansion: 'paradox-rift' },
  },
  {
    name: 'products',
    text: 'Obsidian Flames',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fobsidian_flames.webp?alt=media&token=54f22ac9-ecde-47c5-9f85-11c218b96d66',
    query: { expansion: 'obsidian-flames' },
  },
  {
    name: 'products',
    text: 'Paldea Evolved',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fpaldea_evolve.webp?alt=media&token=9586367d-8f22-4978-9ceb-f43d7d93a0f7',
    query: { expansion: 'paldea-evolved' },
  },
  {
    name: 'products',
    text: 'Scarlet & Violet',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fscarlet_violet.webp?alt=media&token=9bb480ec-ca84-45bd-8177-2112dd543bad',
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

        <div
          v-if="featuredProductStore.isLoading"
          class="grid gap-5 grid-cols-[repeat(auto-fill,minmax(224px,288px))] justify-center"
        >
          <ProductSkeleton v-for="i in 12" :key="i" />
        </div>

        <div
          v-else
          class="grid gap-5 grid-cols-[repeat(auto-fill,minmax(224px,288px))] justify-center"
        >
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
              <router-link :to="{ name: 'products', query: { 'tipo-de-producto': 'booster-box' } }"
                ><h3 class="text-xl font-bold">Booster Box</h3></router-link
              >
              <p class="text-gray-400 mb-3">"Más cartas, más poder."</p>
              <div class="flex gap-3">
                <router-link
                  :to="{
                    name: 'products',
                    query: { 'tipo-de-producto': 'booster-box', expansion: 'surgin-sparks' },
                  }"
                >
                  <article
                    class="flex flex-col gap-2 justify-center items-center cursor-pointer group hover:bg-gray-200 transition-colors p-3 rounded"
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2Fea757bf4ce3.jpg?alt=media&token=123bcd35-0982-4a37-b50c-0256a2ae1f2f"
                      alt="Imagen de producto"
                      class="object-contain w-3/4 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <p class="text-center">Surging Sparks</p>
                  </article>
                </router-link>
                <router-link
                  :to="{
                    name: 'products',
                    query: { 'tipo-de-producto': 'booster-box', expansion: 'twilight-masquerade' },
                  }"
                >
                  <article
                    class="flex flex-col gap-2 justify-center items-center cursor-pointer group hover:bg-gray-200 transition-colors p-3 rounded"
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F757bf4ce31b.jpg?alt=media&token=e388e1b3-cfb7-48d8-9db5-a133ebabeae6"
                      alt="Imagen de producto"
                      class="object-contain w-3/4 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <p class="text-center">Twilight Masquerade</p>
                  </article>
                </router-link>
                <router-link
                  :to="{
                    name: 'products',
                    query: { 'tipo-de-producto': 'booster-box', expansion: 'paradox-rift' },
                  }"
                >
                  <article
                    class="flex flex-col gap-2 justify-center items-center cursor-pointer group hover:bg-gray-200 transition-colors p-3 rounded"
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2Ff4ce31bd9c7.jpg?alt=media&token=2266bb67-877d-49d8-bc3a-7f90225b7864"
                      alt="Imagen de producto"
                      class="object-contain w-3/4 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <p class="text-center">Paradox Rift</p>
                  </article>
                </router-link>
              </div>
            </li>
            <li class="shadow-lg p-6 rounded-lg border border-gray-100 aspect-video">
              <router-link
                :to="{ name: 'products', query: { 'tipo-de-producto': 'elite-trainer-box' } }"
                ><h3 class="text-xl font-bold">Elite Trainer Box</h3></router-link
              >
              <p class="text-gray-400 mb-3">"Todo lo que necesitas."</p>
              <div class="flex gap-3">
                <router-link
                  :to="{
                    name: 'products',
                    query: {
                      'tipo-de-producto': 'elite-trainer-box',
                      expansion: 'prismatic-evolution',
                    },
                  }"
                >
                  <article
                    class="flex flex-col gap-2 justify-center items-center cursor-pointer group hover:bg-gray-200 transition-colors p-3 rounded"
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F646c23fdf4f.jpg?alt=media&token=b47da676-d6d8-4181-8f7b-69ba80ac1d3f"
                      alt="Imagen de producto"
                      class="object-contain w-3/4 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <p class="text-center">Prismatic Evolutions</p>
                  </article>
                </router-link>
                <router-link
                  :to="{
                    name: 'products',
                    query: {
                      'tipo-de-producto': 'elite-trainer-box',
                      expansion: 'twilight-masquerade',
                    },
                  }"
                >
                  <article
                    class="flex flex-col gap-2 justify-center items-center cursor-pointer group hover:bg-gray-200 transition-colors p-3 rounded"
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2Fb9e0631da62.jpg?alt=media&token=d8b90f91-502c-490c-91d0-97be3ba2baa2"
                      alt="Imagen de producto"
                      class="object-contain w-3/4 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <p class="text-center">Twilight Masquerade</p>
                  </article>
                </router-link>
                <router-link
                  :to="{
                    name: 'products',
                    query: { 'tipo-de-producto': 'elite-trainer-box', expansion: 'surgin-sparks' },
                  }"
                >
                  <article
                    class="flex flex-col gap-2 justify-center items-center cursor-pointer group hover:bg-gray-200 transition-colors p-3 rounded"
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2Ffdf4ffb9e06.jpg?alt=media&token=ce69a2a1-9f2d-4a40-a027-e4f3f378d6d2"
                      alt="Imagen de producto"
                      class="object-contain w-3/4 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <p class="text-center">Surging Sparks</p>
                  </article>
                </router-link>
              </div>
            </li>
            <li class="shadow-lg p-6 rounded-lg border border-gray-100 aspect-video">
              <router-link
                :to="{ name: 'products', query: { 'tipo-de-producto': 'premium-collection' } }"
                ><h3 class="text-xl font-bold">Premium Collection</h3></router-link
              >
              <p class="text-gray-400 mb-3">"Exclusividad garantizada."</p>
              <div class="flex gap-3">
                <router-link
                  :to="{
                    name: 'products',
                    query: {
                      'tipo-de-producto': 'premium-collection',
                      expansion: '151',
                    },
                  }"
                >
                  <article
                    class="flex flex-col gap-2 justify-center items-center cursor-pointer group hover:bg-gray-200 transition-colors p-3 rounded"
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F3519f1a27bc.jpg?alt=media&token=0b53965c-bb56-40cc-8c1d-170b98ee8ecd"
                      alt="Imagen de producto"
                      class="object-contain w-3/4 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <p class="text-center">151</p>
                  </article>
                </router-link>
                <router-link
                  :to="{
                    name: 'products',
                    query: {
                      'tipo-de-producto': 'premium-collection',
                      expansion: 'twilight-masquerade',
                    },
                  }"
                >
                  <article
                    class="flex flex-col gap-2 justify-center items-center cursor-pointer group hover:bg-gray-200 transition-colors p-3 rounded"
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F1ad33519f1a.jpg?alt=media&token=70c00a70-facc-4d2b-be1d-5f0f210f8229"
                      alt="Imagen de producto"
                      class="object-contain w-3/4 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <p class="text-center">Twilight Masquerade</p>
                  </article>
                </router-link>
              </div>
            </li>
            <li class="shadow-lg p-6 rounded-lg border border-gray-100 aspect-video">
              <router-link
                :to="{ name: 'products', query: { 'tipo-de-producto': 'producto-cerrado' } }"
                ><h3 class="text-xl font-bold">Booster Bundle</h3></router-link
              >
              <p class="text-gray-400 mb-3">"Ediciones únicas."</p>
              <div class="flex gap-3">
                <router-link
                  :to="{
                    name: 'products',
                    query: {
                      'tipo-de-producto': 'producto-cerrado',
                      expansion: 'prismatic-evolutions',
                    },
                  }"
                >
                  <article
                    class="flex flex-col gap-2 justify-center items-center cursor-pointer group hover:bg-gray-200 transition-colors p-3 rounded"
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F0b0f9033605.jpg?alt=media&token=614cdc69-3461-4060-ac8a-793adf23753b"
                      alt="Imagen de producto"
                      class="object-contain w-3/4 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <p class="text-center">Prismatic Evolutions</p>
                  </article>
                </router-link>
                <router-link
                  :to="{
                    name: 'products',
                    query: {
                      'tipo-de-producto': 'producto-cerrado',
                      expansion: 'shrouded-fable',
                    },
                  }"
                >
                  <article
                    class="flex flex-col gap-2 justify-center items-center cursor-pointer group hover:bg-gray-200 transition-colors p-3 rounded"
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F0f903360534.jpg?alt=media&token=d74cff2a-cb04-4a97-b6b1-eec6eaa066ae"
                      alt="Imagen de producto"
                      class="object-contain w-3/4 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <p class="text-center">Shrouded Fable</p>
                  </article>
                </router-link>
                <router-link
                  :to="{
                    name: 'products',
                    query: {
                      'tipo-de-producto': 'producto-cerrado',
                      expansion: 'surgin-sparks',
                    },
                  }"
                >
                  <article
                    class="flex flex-col gap-2 justify-center items-center cursor-pointer group hover:bg-gray-200 transition-colors p-3 rounded"
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F3360534c646.jpg?alt=media&token=de52f95b-ff72-47b0-bf8b-ed77bcfdb34e"
                      alt="Imagen de producto"
                      class="object-contain w-3/4 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <p class="text-center">Surging Sparks</p>
                  </article>
                </router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>
