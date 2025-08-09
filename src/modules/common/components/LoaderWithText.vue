<script lang="ts" setup>
import LoaderBouncingSquare from '@/modules/common/components/LoaderBouncingSquare.vue';

interface Props {
  text: string;
}

defineProps<Props>();
</script>

<template>
  <div class="flex justify-center items-center mt-6">
    <p>{{ text }}</p>
    <LoaderBouncingSquare class="inline-block ml-2 w-16 text-green-600" />
  </div>
</template>
