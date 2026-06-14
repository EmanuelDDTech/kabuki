<script setup lang="ts">
interface Props {
  items: unknown[];
  columnsClass?: string;
  gapClass?: string;
  listClass?: string;
  itemKey?: string | ((item: unknown, index: number) => string | number);
}

const props = withDefaults(defineProps<Props>(), {
  columnsClass: 'grid-cols-[repeat(auto-fill,minmax(224px,288px))]',
  gapClass: 'gap-5',
  listClass: 'justify-center',
  itemKey: 'id',
});

const getItemKey = (item: unknown, index: number) => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item, index);
  }

  if (typeof props.itemKey === 'string' && item && typeof item === 'object') {
    const value = (item as Record<string, unknown>)[props.itemKey];
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }
  }

  return index;
};
</script>

<template>
  <div :class="['grid', columnsClass, gapClass, listClass]">
    <template v-for="(item, index) in items" :key="getItemKey(item, index)">
      <slot name="item" :item="item" :index="index" />
    </template>
  </div>
</template>
