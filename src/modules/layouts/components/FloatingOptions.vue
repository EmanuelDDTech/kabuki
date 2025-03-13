<script lang="ts" setup></script>
<template>
  <div
    class="h-fit border border-slate-200 shadow bg-white p-2 rounded-md absolute top-full left-1/2 -translate-x-1/2 translate-y-2 z-30"
  >
    <div class="flex flex-col text-slate-900">
      <slot name="options"></slot>
    </div>
  </div>
</template>
