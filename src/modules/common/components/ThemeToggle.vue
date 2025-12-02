<script lang="ts" setup>
import { ref, onMounted } from 'vue';

// Estado inicial del tema
const isDark = ref(false);

const applyTheme = () => {
  const html = document.documentElement;
  if (isDark.value) {
    html.classList.remove('light');
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
    html.classList.add('light');
  }
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme();
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  isDark.value = savedTheme === 'dark';
  applyTheme();
});
</script>

<template>
  <div
    class="inline-block cursor-pointer"
    @click="toggleTheme"
    :aria-label="'Cambiar a modo ' + (isDark ? 'claro' : 'oscuro')"
  >
    <div
      :class="[
        'w-16 h-8 bg-shori-gray-2 rounded-full relative flex items-center justify-between py-1 px-[6px] transition-colors shadow-sm border border-shori-gray-6',
      ]"
    >
      <div
        :class="[
          'z-10 flex items-center justify-center w-5 h-5 transition-all',
          { 'text-shori-gray-12': isDark, 'text-shori-gray-11': !isDark },
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>

      <div
        :class="[
          'z-10 flex items-center justify-center w-5 h-5 transition-all',
          { 'text-shori-gray-11': isDark, 'text-shori-gray-12': !isDark },
        ]"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>
      </div>

      <div
        :class="[
          'absolute top-1/2 -translate-y-1/2 left-[2px] w-7 h-7 rounded-full shadow-sm transition-all z-5',
          { 'translate-x-0 bg-[#3b82f6]': isDark, 'translate-x-[30px] bg-[#ff9d00]': !isDark },
        ]"
      ></div>
    </div>
  </div>
</template>
