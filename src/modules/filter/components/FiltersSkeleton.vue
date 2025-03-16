<template>
  <div class="mt-4 animate-pulse">
    <div class="w-20 h-4 bg-gray-200 mb-1 rounded"></div>

    <div
      v-for="i in 8"
      :key="i"
      class="flex text-sm justify-between items-center hover:bg-gray-100 py-1 px-2 rounded"
    >
      <div class="cursor-pointer h-4 w-36 bg-gray-200 rounded"></div>
      <div class="cursor-pointer h-4 w-4 bg-gray-200 rounded"></div>
    </div>
  </div>
</template>
