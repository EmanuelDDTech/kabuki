<template>
  <div
    class="flex items-center max-w-lg bg-white text-gray-400 rounded-lg flex-1 border-2 border-gray-300"
    x-data="{ search: '' }"
  >
    <div class="border-r-2 border-gray-300">
      <!-- :class="(search.length > 0) ? 'bg-purple-500' : 'bg-gray-500 cursor-not-allowed'"
      :disabled="search.length == 0" -->
      <button
        type="submit"
        class="flex items-center justify-center w-9 aspect-square rounded-r-lg p-1 hover:text-blue-500 transition-colors"
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </button>
    </div>
    <div class="w-full">
      <input
        type="search"
        class="w-full px-4 py-1 text-gray-800 rounded-full focus:outline-none"
        placeholder="Buscar"
        x-model="search"
      />
    </div>
  </div>
</template>
