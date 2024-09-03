<template>
<div>
  <header class="flex mb-6">
    <h2 class="text-3xl font-bold">Preventa</h2>
    <SwiperNavButtons />
  </header>
  
  <Swiper
    :modules="modules"
    :spaceBetween="20"
    :slidesPerView="5"
    :navigation="{ nextEl: '#swiper-next', prevEl: '#swiper-prev'}"
    className="py-3 overflow-hidden"
  >
    <SwiperSlide> 
      <ProductCard />
    </SwiperSlide>
    <SwiperSlide> 
      <ProductCard />
    </SwiperSlide>
    <SwiperSlide> 
      <ProductCard />
    </SwiperSlide>
    <SwiperSlide> 
      <ProductCard />
    </SwiperSlide>
    <SwiperSlide> 
      <ProductCard />
    </SwiperSlide>
    <SwiperSlide> 
      <ProductCard />
    </SwiperSlide>
    <SwiperSlide> 
      <ProductCard />
    </SwiperSlide>
  </Swiper>
</div>
</template>

<script setup lang="ts">
import { Navigation, Pagination} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperNavButtons from './SwiperNavButtons.vue'
import ProductCard from '@/modules/products/components/ProductCard.vue'

const modules = [Pagination, Navigation]

// interface Props {

// }

// defineProps({
//   products: {
//     type: Array,
//     required: true,
//   }
// })

</script>