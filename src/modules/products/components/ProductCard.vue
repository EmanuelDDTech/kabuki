<template>
  <article
    class="relative max-w-72 min-w-56 bg-white shadow-md rounded-3xl p-2 cursor-pointer border border-gray-100"
  >
    <div
      class="aspect-[4/3] overflow-x-hidden rounded-2xl relative flex items-center justify-center"
    >
      <img class="h-4/5" src="@assets/img/producto.webp" />
      <p class="absolute right-2 top-2 rounded-full p-2 cursor-pointer group bg-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 group-hover:opacity-50 opacity-70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="black"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </p>
    </div>
    <div class="mt-4 pl-2 mb-2 justify-between">
      <p class="font-normal text-black mb-5">League Battle Deck -Charizard ex- PREVENTA</p>
      <div class="flex gap-2 items-center relative">
        <p class="text-xl text-black font-bold mt-0">$300</p>
        <p class="text-base text-gray-500 line-through font-normal mt-0">$340</p>
        <div class="group cursor-pointer bg-gray-100 p-2 rounded-full absolute right-2 bottom-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 group-hover:opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="gray"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts"></script>

<style scoped></style>
