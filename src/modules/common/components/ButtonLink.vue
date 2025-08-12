<script lang="ts" setup>
import type { Component } from 'vue';

interface ButtonLinkProps {
  to: string;
  text: string;
  type?: 'primary' | 'secondary' | 'tertiary';
  status?: 'enabled' | 'disabled';
  size?: 'small' | 'medium' | 'large';
  icon?: Component;
}

withDefaults(defineProps<ButtonLinkProps>(), {
  type: 'primary',
  status: 'enabled',
  size: 'medium',
});
</script>

<template>
  <RouterLink
    :to="{ name: to }"
    class="gap-2 hidden sm:inline-flex ml-5 font-medium rounded-lg text-center items-center mr-3 transition-colors"
    :class="[
      type === 'primary' ? 'bg-green-600 hover:bg-green-700 text-white' : '',
      type === 'secondary'
        ? 'border border-green-600 hover:border-green-700 hover:bg-green-50 text-green-600'
        : '',
      type === 'tertiary' ? 'text-green-600 underline hover:text-green-700' : '',
      status === 'disabled' ? 'opacity-50 cursor-not-allowed' : '',
      size === 'small' ? 'text-xs px-3 py-1.5' : '',
      size === 'medium' ? 'text-sm px-4 py-2' : '',
      size === 'large' ? 'text-lg px-6 py-3' : '',
    ]"
  >
    <component v-if="icon" :is="icon" class="w-6" />
    {{ text }}
  </RouterLink>
</template>
