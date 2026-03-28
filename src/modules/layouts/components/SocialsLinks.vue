<script setup lang="ts">
import InstagramIcon from '@/modules/common/icons/InstagramIcon.vue';
import TiktokIcon from '@/modules/common/icons/TiktokIcon.vue';
import YoutubeIcon from '@/modules/common/icons/YoutubeIcon.vue';

const openLink = (url: string) => {
  window.open(url, '_blank');
};
</script>

<template>
  <div class="flex justify-center gap-3 px-2 items-center text-shori-gray-12">
    <YoutubeIcon
      @click="openLink('https://www.youtube.com/@KabukiCards')"
      class="w-5 h-5 cursor-pointer hover:text-shori-gray-9 transition-colors"
    />
    <TiktokIcon
      @click="openLink('https://www.tiktok.com/@kabukicards')"
      class="w-5 h-5 cursor-pointer hover:text-shori-gray-9 transition-colors"
    />
    <InstagramIcon
      @click="openLink('https://www.instagram.com/shorikame_cards?igsh=MXFpcmt4cjdpaWJsMw==')"
      class="w-5 h-5 cursor-pointer hover:text-shori-gray-9 transition-colors"
    />
  </div>
</template>
