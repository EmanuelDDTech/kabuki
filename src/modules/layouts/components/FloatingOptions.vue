<script lang="ts" setup></script>
<template>
  <div
    class="h-fit border border-shori-gray-6 shadow bg-shori-gray-2 p-2 rounded-md absolute top-full left-1/2 -translate-x-1/2 translate-y-2 z-1000"
  >
    <div class="flex flex-col text-shori-gray-12">
      <slot name="options"></slot>
    </div>
  </div>
</template>
