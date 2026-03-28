<script setup lang="ts">
import SwiperSlider from '@/modules/slider/components/SwiperSlider.vue';
import MainBanner from '../components/MainBanner.vue';
import NavBar from '../components/NavBar.vue';
import LightingIcon from '@/modules/icons/LightingIcon.vue';
import DiscountIcon from '@/modules/icons/DiscountIcon.vue';
import ClosedBoxIcon from '../components/ClosedBoxIcon.vue';
import ArrowRight from '@/modules/icons/ArrowRight.vue';
import { useCampaignStore } from '@/modules/campaign/stores/campaign';
import { onBeforeMount, onMounted } from 'vue';
import { converToDDMMYYYY, displayDate } from '@/helpers/date';
import { date } from '@vueform/vueform';
import StarIcon from '@/modules/common/icons/StarIcon.vue';
import TruckIcon from '@/modules/common/icons/TruckIcon.vue';
import CreditCardIcon from '@/modules/common/icons/CreditCardIcon.vue';
import CertificateIcon from '@/modules/common/icons/CertificateIcon.vue';
import CircleCheckIcon from '@/modules/common/icons/CircleCheckIcon.vue';
import CollectionIcon from '@/modules/common/icons/CollectionIcon.vue';
import { useFeaturedProductStore } from '../stores/featuredProduct';
import ProductCard from '@/modules/products/components/ProductCard.vue';
import ProductSkeleton from '@/modules/products/components/ProductSkeleton.vue';

const campaign = useCampaignStore();
const featuredProductStore = useFeaturedProductStore();

const trustBadges = [
  {
    icon: TruckIcon,
    title: 'Envío a todo México',
    description: 'Recibe tus cartas de forma segura en la puerta de tu casa.',
  },
  {
    icon: CertificateIcon,
    title: 'Producto 100% original',
    description: 'Cartas y productos sellados directamente de The Pokémon Company.',
  },
  {
    icon: CreditCardIcon,
    title: 'Pago seguro',
    description: 'Compra con confianza. Aceptamos múltiples métodos de pago.',
  },
  {
    icon: CircleCheckIcon,
    title: 'Atención personalizada',
    description: 'Resolvemos tus dudas por WhatsApp e Instagram.',
  },
];

const seriesHighlights = [
  {
    name: 'Scarlet & Violet',
    description: 'La era más reciente del TCG con mecánicas ex y Tera.',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fprismatic-Photoroom.png?alt=media&token=0f6dfa57-e11c-44be-9788-14024d1047ac',
    color: 'from-red-500/10 to-violet-500/10',
    borderColor: 'hover:border-red-400',
    serieId: 'sv',
  },
  {
    name: 'Sword & Shield',
    description: 'VMax, VStars y las cartas más icónicas del formato pasado.',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fstellar_crown-Photoroom.png?alt=media&token=9292a456-67b8-4391-ae85-d3278ccb7531',
    color: 'from-cyan-500/10 to-blue-500/10',
    borderColor: 'hover:border-cyan-400',
    serieId: 'swsh',
  },
  {
    name: 'Sun & Moon',
    description: 'GXs, Tag Teams y expansiones legendarias.',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fshrouded_fable-Photoroom.png?alt=media&token=04344873-eb4c-49aa-b040-ef31807628aa',
    color: 'from-orange-500/10 to-yellow-500/10',
    borderColor: 'hover:border-orange-400',
    serieId: 'sm',
  },
];

const closedProductCategories = [
  {
    title: 'Booster Box',
    tagline: 'Más cartas, más poder.',
    queryType: 'booster-box',
    products: [
      {
        name: 'Surging Sparks',
        expansion: 'surgin-sparks',
        img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2Fea757bf4ce3.jpg?alt=media&token=123bcd35-0982-4a37-b50c-0256a2ae1f2f',
      },
      {
        name: 'Twilight Masquerade',
        expansion: 'twilight-masquerade',
        img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F757bf4ce31b.jpg?alt=media&token=e388e1b3-cfb7-48d8-9db5-a133ebabeae6',
      },
      {
        name: 'Paradox Rift',
        expansion: 'paradox-rift',
        img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2Ff4ce31bd9c7.jpg?alt=media&token=2266bb67-877d-49d8-bc3a-7f90225b7864',
      },
    ],
  },
  {
    title: 'Elite Trainer Box',
    tagline: 'Todo lo que necesitas.',
    queryType: 'elite-trainer-box',
    products: [
      {
        name: 'Prismatic Evolutions',
        expansion: 'prismatic-evolution',
        img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F646c23fdf4f.jpg?alt=media&token=b47da676-d6d8-4181-8f7b-69ba80ac1d3f',
      },
      {
        name: 'Twilight Masquerade',
        expansion: 'twilight-masquerade',
        img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2Fb9e0631da62.jpg?alt=media&token=d8b90f91-502c-490c-91d0-97be3ba2baa2',
      },
      {
        name: 'Surging Sparks',
        expansion: 'surgin-sparks',
        img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2Ffdf4ffb9e06.jpg?alt=media&token=ce69a2a1-9f2d-4a40-a027-e4f3f378d6d2',
      },
    ],
  },
  {
    title: 'Premium Collection',
    tagline: 'Exclusividad garantizada.',
    queryType: 'premium-collection',
    products: [
      {
        name: '151',
        expansion: '151',
        img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F3519f1a27bc.jpg?alt=media&token=0b53965c-bb56-40cc-8c1d-170b98ee8ecd',
      },
      {
        name: 'Twilight Masquerade',
        expansion: 'twilight-masquerade',
        img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F1ad33519f1a.jpg?alt=media&token=70c00a70-facc-4d2b-be1d-5f0f210f8229',
      },
    ],
  },
  {
    title: 'Booster Bundle',
    tagline: 'Ediciones únicas.',
    queryType: 'producto-cerrado',
    products: [
      {
        name: 'Prismatic Evolutions',
        expansion: 'prismatic-evolution',
        img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F0b0f9033605.jpg?alt=media&token=614cdc69-3461-4060-ac8a-793adf23753b',
      },
      {
        name: 'Shrouded Fable',
        expansion: 'shrouded-fable',
        img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F0f903360534.jpg?alt=media&token=d74cff2a-cb04-4a97-b6b1-eec6eaa066ae',
      },
      {
        name: 'Surging Sparks',
        expansion: 'surgin-sparks',
        img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F3360534c646.jpg?alt=media&token=de52f95b-ff72-47b0-bf8b-ed77bcfdb34e',
      },
    ],
  },
];

const routes = [
  {
    name: 'products',
    text: 'Phantasmal Flames',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fphantasmal_flames-Photoroom.png?alt=media&token=ab6257f9-2e15-45bf-8b57-0861a2d9d4f0',
    query: { expansion: 'phantasmal-flames' },
  },
  {
    name: 'products',
    text: 'Mega Evolution',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fmega-evolution-Photoroom.png?alt=media&token=15852ead-ef0c-4314-b2d0-441ed9d0181a',
    query: { expansion: 'mega-evolution' },
  },
  {
    name: 'products',
    text: 'Black & White',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fblack-%26-white-Photoroom.png?alt=media&token=e7b915df-bb61-454a-878f-f2902761eafd',
    query: { expansion: 'black-&-white' },
  },
  {
    name: 'products',
    text: 'Destined Rivals',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fdestined-rivals-Photoroom.png?alt=media&token=766a6e58-db08-4477-930c-f9771b719993',
    query: { expansion: 'destined-rivals' },
  },
  {
    name: 'products',
    text: 'Journey Together',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fjourney-together-Photoroom.png?alt=media&token=c13050fa-c86f-4f69-b434-c7a5bc5b5cfe',
    query: { expansion: 'journey-together' },
  },
  {
    name: 'products',
    text: 'Prismatic Evolutions',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fprismatic-Photoroom.png?alt=media&token=0f6dfa57-e11c-44be-9788-14024d1047ac',
    query: { expansion: 'prismatic-evolution' },
  },
  {
    name: 'products',
    text: 'Surgin Sparks',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fsurgin_sparks-Photoroom.png?alt=media&token=07ee7fe9-2e9d-4d20-9440-6b14d88e3ddc',
    query: { expansion: 'surgin-sparks' },
  },
  {
    name: 'products',
    text: 'Stellar Crown',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fstellar_crown-Photoroom.png?alt=media&token=9292a456-67b8-4391-ae85-d3278ccb7531',
    query: { expansion: 'stellar-crown' },
  },
  {
    name: 'products',
    text: 'Shrouded Fable',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fshrouded_fable-Photoroom.png?alt=media&token=04344873-eb4c-49aa-b040-ef31807628aa',
    query: { expansion: 'shrouded-fable' },
  },
  {
    name: 'products',
    text: 'Twilight Masquerade',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Ftwilight_masquerade-Photoroom.png?alt=media&token=6ea2c443-b0ee-46f6-90ca-9edfd16058ec',
    query: { expansion: 'twilight-masquerade' },
  },
  {
    name: 'products',
    text: 'Temporal Forces',
    img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Ftemporal_forces-Photoroom.png?alt=media&token=15830a31-4e19-40fa-8362-15dea4d2043f',
    query: { expansion: 'temporal-forces' },
  },
  // {
  //   name: 'products',
  //   text: 'Paldean Fates',
  //   img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fpaldean_fate.webp?alt=media&token=06d8bea9-baab-45e6-80e5-27a07204490d',
  //   query: { expansion: 'paldean-fates' },
  // },
  // {
  //   name: 'products',
  //   text: 'Paradox Rift',
  //   img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fparadox_rift.webp?alt=media&token=e9b51d4f-e5f5-4a12-963c-db201b4b9625',
  //   query: { expansion: 'paradox-rift' },
  // },
  // {
  //   name: 'products',
  //   text: 'Obsidian Flames',
  //   img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fobsidian_flames.webp?alt=media&token=54f22ac9-ecde-47c5-9f85-11c218b96d66',
  //   query: { expansion: 'obsidian-flames' },
  // },
  // {
  //   name: 'products',
  //   text: 'Paldea Evolved',
  //   img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fpaldea_evolve.webp?alt=media&token=9586367d-8f22-4978-9ceb-f43d7d93a0f7',
  //   query: { expansion: 'paldea-evolved' },
  // },
  // {
  //   name: 'products',
  //   text: 'Scarlet & Violet',
  //   img: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fscarlet_violet.webp?alt=media&token=9bb480ec-ca84-45bd-8177-2112dd543bad',
  //   query: { expansion: 'scarlet-&-violet' },
  // },
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

    <!-- Campañas -->
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

    <!-- Producto destacado -->
    <section class="px-3">
      <div class="max-w-screen-xl mx-auto py-14">
        <div class="flex items-center gap-3 mb-8">
          <StarIcon class="w-9 h-9 text-shori-gray-contrast bg-shori-green-9 p-2 rounded-full" />
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

    <!-- Producto cerrado -->
    <section class="px-3 pb-16">
      <div class="max-w-screen-xl mx-auto py-8">
        <header class="flex items-center gap-3 mb-10">
          <ClosedBoxIcon
            class="w-9 aspect-square text-shori-gray-contrast bg-shori-green-9 p-2 rounded-full"
          />
          <h2 class="text-4xl font-bold">Producto cerrado</h2>
        </header>

        <ul class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <li
            v-for="category in closedProductCategories"
            :key="category.queryType"
            class="closed-product-card group/card"
          >
            <div class="closed-product-card__accent" />

            <div class="p-6 flex flex-col h-full relative">
              <!-- Header -->
              <div class="flex items-start justify-between mb-4">
                <div>
                  <router-link
                    :to="{ name: 'products', query: { 'tipo-de-producto': category.queryType } }"
                    class="inline-block"
                  >
                    <h3
                      class="text-2xl font-bold text-shori-gray-12 group-hover/card:text-shori-green-9 transition-colors"
                    >
                      {{ category.title }}
                    </h3>
                  </router-link>
                  <p class="text-shori-gray-11 italic mt-1">"{{ category.tagline }}"</p>
                </div>
                <router-link
                  :to="{ name: 'products', query: { 'tipo-de-producto': category.queryType } }"
                  class="flex items-center gap-1 text-sm font-semibold text-shori-green-9 hover:text-shori-green-11 transition-colors shrink-0 mt-1"
                >
                  Ver todos
                  <ArrowRight class="w-4 h-4" />
                </router-link>
              </div>

              <!-- Products -->
              <div class="flex-1 flex items-center">
                <div class="grid grid-cols-3 gap-4 w-full">
                  <router-link
                    v-for="product in category.products"
                    :key="product.expansion"
                    :to="{
                      name: 'products',
                      query: {
                        'tipo-de-producto': category.queryType,
                        expansion: product.expansion,
                      },
                    }"
                    class="group"
                  >
                    <article class="closed-product-item">
                      <div
                        class="aspect-square rounded-xl bg-white border border-shori-gray-4 flex items-center justify-center p-3 overflow-hidden group-hover:border-shori-green-6 group-hover:shadow-md transition-all duration-300"
                      >
                        <img
                          :src="product.img"
                          :alt="`Imagen de ${product.name}`"
                          class="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <p
                        class="text-sm text-center font-medium mt-2 text-shori-gray-11 group-hover:text-shori-green-9 transition-colors"
                      >
                        {{ product.name }}
                      </p>
                    </article>
                  </router-link>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- Beneficios / Trust badges -->
    <section class="px-3 py-16 bg-shori-gray-2 border-y border-shori-gray-5">
      <div class="max-w-screen-xl mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="badge in trustBadges" :key="badge.title" class="trust-badge group">
            <div
              class="w-12 h-12 rounded-xl bg-shori-green-3 flex items-center justify-center mb-4 group-hover:bg-shori-green-9 transition-colors duration-300"
            >
              <component
                :is="badge.icon"
                class="w-6 h-6 text-shori-green-9 group-hover:text-shori-gray-contrast transition-colors duration-300"
              />
            </div>
            <h3 class="font-bold text-lg text-shori-gray-12 mb-1">{{ badge.title }}</h3>
            <p class="text-sm text-shori-gray-11 leading-relaxed">{{ badge.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Explora por serie -->
    <section class="px-3">
      <div class="max-w-screen-xl mx-auto py-16">
        <header class="flex items-center justify-between mb-10">
          <div class="flex items-center gap-3">
            <CollectionIcon
              class="w-9 h-9 text-shori-gray-contrast bg-shori-green-9 p-2 rounded-full"
            />
            <h2 class="text-4xl font-bold">Explora por serie</h2>
          </div>
          <router-link
            :to="{ name: 'series' }"
            class="flex items-center gap-1 text-sm font-semibold text-shori-green-9 hover:text-shori-green-11 transition-colors"
          >
            Ver todas las series
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <router-link
            v-for="serie in seriesHighlights"
            :key="serie.name"
            :to="{ name: 'setsBySeries', params: { serieId: serie.serieId } }"
            class="group"
          >
            <article
              :class="[
                'h-full serie-card border border-shori-gray-6 rounded-2xl overflow-hidden bg-gradient-to-br',
                serie.color,
                serie.borderColor,
              ]"
            >
              <div class="p-6 flex flex-col h-full min-h-[220px]">
                <div class="flex-1">
                  <h3
                    class="text-2xl font-bold text-shori-gray-12 mb-2 group-hover:text-shori-green-9 transition-colors"
                  >
                    {{ serie.name }}
                  </h3>
                  <p class="text-shori-gray-11 text-sm leading-relaxed">{{ serie.description }}</p>
                </div>
                <div class="flex justify-end mt-4">
                  <img
                    :src="serie.img"
                    :alt="serie.name"
                    class="w-28 h-28 object-contain drop-shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            </article>
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="px-3 pb-16">
      <div class="max-w-screen-xl mx-auto rounded-2xl overflow-hidden cta-section">
        <div class="px-8 py-14 md:px-16 md:py-20 text-center relative">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para completar tu colección?
          </h2>
          <p class="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Descubre las últimas expansiones, las mejores preventas y los precios más competitivos
            en cartas Pokémon TCG.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              :to="{ name: 'products' }"
              class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-shori-green-9 font-bold rounded-xl hover:bg-green-50 transition-colors shadow-lg"
            >
              Ver productos
              <ArrowRight class="w-4 h-4" />
            </router-link>
            <router-link
              :to="{ name: 'series' }"
              class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/15 text-white font-bold rounded-xl hover:bg-white/25 transition-colors border border-white/30"
            >
              Explorar series
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.closed-product-card {
  position: relative;
  background: var(--gray-2);
  border: 1px solid var(--gray-6);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04);
}

.closed-product-card:hover {
  border-color: var(--green-7);
  box-shadow:
    0 10px 25px -5px rgba(22, 163, 74, 0.08),
    0 8px 10px -6px rgba(22, 163, 74, 0.04);
  transform: translateY(-2px);
}

.closed-product-card__accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--green-8), var(--green-9), var(--green-7));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.closed-product-card:hover .closed-product-card__accent {
  opacity: 1;
}

.trust-badge {
  text-align: center;
  padding: 1.5rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.trust-badge:hover {
  background: var(--gray-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.serie-card {
  transition: all 0.3s ease;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04);
}

.serie-card:hover {
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.08),
    0 8px 10px -6px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.cta-section {
  background: linear-gradient(135deg, var(--green-9) 0%, var(--green-11) 50%, var(--green-12) 100%);
}
</style>
