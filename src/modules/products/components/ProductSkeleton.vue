<template>
  <article
    class="flex flex-col relative max-w-72 min-w-56 h-full bg-white shadow-md rounded-2xl p-2 cursor-pointer border border-gray-100 animate-pulse"
  >
    <div
      class="aspect-[4/3] overflow-x-hidden rounded-2xl relative flex items-center justify-center"
    >
      <div class="h-4/5 bg-gray-200 w-full rounded"></div>
    </div>

    <div class="flex-1 flex flex-col mt-4 px-2 mb-2 justify-between">
      <p class="w-full h-4 bg-gray-200 rounded-lg"></p>

      <div class="mb-2">
        <p class="w-24 h-2 bg-gray-200 rounded-lg"></p>
      </div>

      <div class="flex gap-4 items-start">
        <p class="w-16 h-4 bg-gray-200 rounded-lg"></p>
        <p class="w-16 h-4 bg-gray-200 rounded-lg"></p>
      </div>
    </div>
  </article>
</template>
