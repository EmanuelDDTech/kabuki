<template>
  <BannerSkeleton v-if="banners.isLoading" />
  <swiper
    v-else
    :spaceBetween="0"
    :autoplay="{
      delay: 8000,
      disableOnInteraction: false,
    }"
    navigation
    :slidesPerView="1"
    :modules="modules"
    :pagination="{
      clickable: true,
    }"
    :loop="true"
  >
    <swiper-slide v-for="banner in banners.banners" :key="banner.id"
      ><a :href="banner.redirect"
        ><img :src="banner.url" alt="Imagen del banner" loading="lazy" /></a
    ></swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { useBannersStore } from '@/modules/banner/stores/banners';
import { onMounted } from 'vue';
import BannerSkeleton from '@/modules/banner/components/BannerSkeleton.vue';

const banners = useBannersStore();
const modules = [Navigation, Pagination, Mousewheel, Autoplay];

onMounted(async () => {
  await banners.getBanners();
});
</script>

<style scoped>
.swiper {
  /* height: 500px; */
  max-height: 500px;
  aspect-ratio: 8/3;
}

.swiper-slide {
  font-size: 18px;
  background: #fff;
  height: 100%;

  /* Center slide text vertically */
  display: flex;
  place-content: center;
}

.swiper-slide img {
  object-fit: cover;
  height: 100%;
}
</style>
