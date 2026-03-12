<script lang="ts" setup>
import type { Component } from 'vue';

interface ButtonProps {
  text: string;
  type?: 'primary' | 'secondary' | 'tertiary';
  status?: 'enabled' | 'disabled';
  size?: 'small' | 'medium' | 'large';
  icon?: Component;
  width?: 'full' | 'inline';
}

withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  status: 'enabled',
  size: 'medium',
  width: 'inline',
});
</script>

<template>
  <div
    v-ripple
    class="gap-2 font-medium rounded-lg cursor-pointer text-center justify-center items-center transition-all duration-300 active:scale-95"
    :class="[
      type === 'primary' ? 'bg-shori-green-9 hover:bg-shori-green-10 text-white' : '',
      type === 'secondary'
        ? 'border border-shori-green-6 hover:border-shori-green-10 hover:bg-green-3 text-shori-green-12'
        : '',
      type === 'tertiary' ? 'text-shori-green-12 underline hover:text-shori-green-10' : '',
      status === 'disabled' ? 'opacity-50 cursor-not-allowed' : '',
      size === 'small' ? 'text-xs px-3 py-1.5' : '',
      size === 'medium' ? 'text-sm px-4 py-2' : '',
      size === 'large' ? 'text-lg px-6 py-3' : '',
      width === 'inline' ? 'inline-flex' : '',
      width === 'full' ? 'w-full flex' : '',
    ]"
  >
    <component v-if="icon" :is="icon" class="w-6" />
    {{ text }}
  </div>
</template>
