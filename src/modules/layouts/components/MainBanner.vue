<template>
  <swiper
    :spaceBetween="0"
    :autoplay="{
      delay: 3000,
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
      ><img :src="banner.url" alt=""
    /></swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { useBannersStore } from '@/modules/banner/stores/banners';
import { onMounted } from 'vue';

const banners = useBannersStore();
const modules = [Navigation, Pagination, Mousewheel, Autoplay];

onMounted(async () => {
  await banners.getBanners();
});
</script>

<style scoped>
.swiper {
  width: 100%;
  min-height: 300px;
  max-height: 500px;
}

.swiper-slide {
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  place-content: center;
}

.swiper-slide img {
  object-fit: cover;
  min-height: 300px;
}
</style>
