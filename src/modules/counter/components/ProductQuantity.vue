<template>
  <div class="flex gap-1 items-center">
    <button class="btn" @click="$emit('res')" v-if="editable">-</button>
    <p class="w-6 text-center">{{ value }}</p>
    <button class="btn" @click="$emit('sum')" v-if="editable">+</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

// import { useCounter } from '../composable/useCounter';

interface Props {
  value: number;
  editable: boolean;
}

const props = defineProps<Props>();
// const { counter, res, sum } = useCounter(props.value);
</script>

<style scoped>
.btn {
  @apply aspect-square rounded border border-gray-500 hover:bg-gray-100 w-6 text-sm;
}
</style>
