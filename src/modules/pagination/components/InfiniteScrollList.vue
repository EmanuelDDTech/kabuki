<template>
  <div>
    <!-- GRID / LIST LAYOUT -->
    <div>
      <slot name="items" :items="items" />
    </div>

    <!-- LOADER -->
    <div v-if="loading">
      <slot name="loader"> Loading ... </slot>
    </div>

    <!-- NO MORE ITEMS -->
    <div v-if="!hasMore && items.length">
      <slot name="end"> No more results </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core';
// import { useTemplateRef } from 'vue';

interface Props {
  items: any[];
  loading?: boolean;
  hasMore?: boolean;
  distance?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasMore: true,
  distance: 200,
});

const emit = defineEmits<{
  (e: 'load-more'): void;
}>();

// Use the window scroll instead of an inner scroll container so the page has a single natural scrollbar.
if (typeof window !== 'undefined') {
  useInfiniteScroll(
    window,
    () => {
      // console.log('Scrolled to bottom');
      if (!props.loading && props.hasMore) {
        emit('load-more');
      }
    },
    {
      distance: props.distance,
    },
  );
}
</script>
