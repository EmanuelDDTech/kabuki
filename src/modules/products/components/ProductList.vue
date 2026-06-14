<script setup lang="ts" generic="TItem">
export interface ProductListProps<TItem> {
  items: TItem[];
  columnsClass?: string;
  gapClass?: string;
  listClass?: string;
  itemKey?: Extract<keyof TItem, string> | ((item: TItem, index: number) => string | number);
}

const props = withDefaults(defineProps<ProductListProps<TItem>>(), {
  columnsClass: 'grid-cols-[repeat(auto-fill,minmax(200px,1fr))]',
  gapClass: 'gap-5',
  listClass: 'justify-center',
  itemKey: 'id' as Extract<keyof TItem, string>,
});

defineSlots<{
  item(props: { item: TItem; index: number }): unknown;
}>();

const getItemKey = (item: TItem, index: number) => {
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
