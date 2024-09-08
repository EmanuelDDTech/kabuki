<template>
  <nav
    id=".image-row"
    class="flex justify-between text-base max-w-screen-xl mx-auto text-center leading-none py-9 overflow-x-auto snap-mandatory"
  >
    <RouterLink
      v-for="route in routes"
      :to="{ name: route.name }"
      :key="route.name"
      class="group py-3 px-3 mx-2 min-w-[100px] w-[100px] relative hover:text-blue-500 transition-all duration-300 after:transition-all after:duration-300 after:content-[''] after:w-0 after:absolute after:h-[2px] after:bottom-0 after:right-2/4 after:bg-blue-500 after:translate-x-2/4 hover:after:w-full"
      draggable="false"
    >
      <div>
        <img
          :src="getImageUrl(route.img)"
          :alt="route.text"
          class="group-hover:animate-customBounce transition-transform ease-out flex-grow-0 flex-shrink-0 basis-auto"
          draggable="false"
        />
      </div>
      {{ route.text }}
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface route {
  name: string;
  text: string;
  img: string;
}

interface Props {
  routes: route[];
}

defineProps<Props>();

const getImageUrl = (imageName: string) => {
  return new URL(`/src/assets/img/${imageName}`, import.meta.url).href;
};

// onMounted(() => {
//   imageRow.value = document.querySelector('#image-row');

//   if (!imageRow.value) return;

//   document.addEventListener('DOMContentLoaded', function () {
//     let isDown = false;
//     let startX: number;
//     let scrollLeft: number;

//     if (!imageRow.value) return;

//     imageRow.value.addEventListener('mousedown', (e) => {
//       isDown = true;
//       if (!imageRow.value) return;
//       imageRow.value.classList.add('active');
//       startX = e.pageX - imageRow.value.offsetLeft;
//       scrollLeft = imageRow.value.scrollLeft;
//     });

//     imageRow.value.addEventListener('mouseleave', () => {
//       isDown = false;
//       if (!imageRow.value) return;
//       imageRow.value.classList.remove('active');
//     });

//     imageRow.value.addEventListener('mouseup', () => {
//       isDown = false;
//       if (!imageRow.value) return;
//       imageRow.value.classList.remove('active');
//     });

//     imageRow.value.addEventListener('mousemove', (e) => {
//       if (!isDown) return;
//       e.preventDefault();
//       if (!imageRow.value) return;
//       const x = e.pageX - imageRow.value.offsetLeft;
//       const walk = (x - startX) * 3; // Multiplica el valor para hacer el desplazamiento más rápido
//       imageRow.value.scrollLeft = scrollLeft - walk;
//     });

//     imageRow.value.addEventListener('touchstart', (e) => {
//       isDown = true;
//       if (!imageRow.value) return;
//       startX = e.touches[0].pageX - imageRow.value.offsetLeft;
//       scrollLeft = imageRow.value.scrollLeft;
//     });

//     imageRow.value.addEventListener('touchend', () => {
//       isDown = false;
//     });

//     imageRow.value.addEventListener('touchmove', (e) => {
//       if (!isDown) return;
//       if (!imageRow.value) return;
//       const x = e.touches[0].pageX - imageRow.value.offsetLeft;
//       const walk = (x - startX) * 3; // Multiplica el valor para hacer el desplazamiento más rápido
//       imageRow.value.scrollLeft = scrollLeft - walk;
//     });
//   });
// });
</script>
