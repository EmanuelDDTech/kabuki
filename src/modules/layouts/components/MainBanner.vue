<template>
  <swiper
    :spaceBetween="0"
    navigation
    :slidesPerView="1"
    :modules="modules"
    :pagination="{
      clickable: true,
    }"
    :loop="true"
    :autoplay="{
      delay: 3000,
    }"
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
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';

const modules = [Navigation, Pagination, Mousewheel];
</script>

<style scoped>
.swiper {
  width: 100%;
  min-height: 400px;
  max-height: 600px;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
}

.swiper-slide img {
  object-fit: cover;
  min-height: 400px;
}
</style>
