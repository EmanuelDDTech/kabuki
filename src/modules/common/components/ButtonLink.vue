<script lang="ts" setup>
import type { Component } from 'vue';
import HomeGoIcon from '../icons/HomeGoIcon.vue';

interface ButtonLinkProps {
  to: string;
  text: string;
  type?: ButtonLinkType;
  status?: ButtonLinkStatus;
  size?: ButtonLinkSize;
  icon?: Component;
}

enum ButtonLinkType {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
}

enum ButtonLinkSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

enum ButtonLinkStatus {
  enabled = 'enabled',
  disabled = 'disabled',
}

withDefaults(defineProps<ButtonLinkProps>(), {
  type: ButtonLinkType.primary,
  status: ButtonLinkStatus.enabled,
  size: ButtonLinkSize.medium,
});
</script>

<template>
  <RouterLink
    :to="{ name: to }"
    class="gap-2 hidden sm:inline-flex ml-5 font-medium rounded-lg text-center items-center mr-3 transition-colors"
    :class="[
      type === ButtonLinkType.primary ? 'bg-green-600 hover:bg-green-700 text-white' : '',
      type === ButtonLinkType.secondary
        ? 'border border-green-600 hover:border-green-700 hover:bg-green-50 text-green-600'
        : '',
      type === ButtonLinkType.tertiary ? 'text-green-600 underline hover:text-green-700' : '',
      status === ButtonLinkStatus.disabled ? 'opacity-50 cursor-not-allowed' : '',
      size === ButtonLinkSize.small ? 'text-xs px-3 py-1.5' : '',
      size === ButtonLinkSize.medium ? 'text-sm px-4 py-2' : '',
      size === ButtonLinkSize.large ? 'text-lg px-6 py-3' : '',
    ]"
  >
    <!-- <HomeGoIcon class="w-6" /> -->
    <component v-if="icon" :is="icon" class="w-6" />
    {{ text }}
  </RouterLink>
</template>
