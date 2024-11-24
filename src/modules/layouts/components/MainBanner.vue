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
    <swiper-slide><img src="@assets/img/banner.jpg" alt="" /></swiper-slide>
    <swiper-slide><img src="@assets/img/banner.jpg" alt="" /></swiper-slide>
    <swiper-slide><img src="@assets/img/banner.jpg" alt="" /></swiper-slide>
    <swiper-slide><img src="@assets/img/banner.jpg" alt="" /></swiper-slide>
    <swiper-slide><img src="@assets/img/banner.jpg" alt="" /></swiper-slide>
    <swiper-slide><img src="@assets/img/banner.jpg" alt="" /></swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Mousewheel, Navigation, Pagination } from 'swiper/modules';

const modules = [Navigation, Pagination, Mousewheel, Autoplay];
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
