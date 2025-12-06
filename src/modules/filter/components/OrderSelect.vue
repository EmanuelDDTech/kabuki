<script lang="ts" setup>
import { FormKit } from '@formkit/vue';

defineProps<{
  order: { orderBy: string; orderDirection: string };
}>();

defineEmits<{
  (e: 'update:order', value: { orderBy: string; orderDirection: string }): void;
}>();
</script>

<template>
  <FormKit
    type="select"
    label="Ordenar por"
    :options="[
      {
        value: { orderBy: 'price', orderDirection: 'asc' },
        label: 'Precio: de menor a mayor',
      },
      {
        value: { orderBy: 'price', orderDirection: 'desc' },
        label: 'Precio: de mayor a menor',
      },
      { value: { orderBy: 'name', orderDirection: 'asc' }, label: 'Nombre: A-Z' },
      { value: { orderBy: 'name', orderDirection: 'desc' }, label: 'Nombre: Z-A' },
      {
        value: { orderBy: 'created_at', orderDirection: 'desc' },
        label: 'Más recientes',
      },
      {
        value: { orderBy: 'created_at', orderDirection: 'asc' },
        label: 'Más antiguos',
      },
    ]"
    :value="order"
    @input="$emit('update:order', { ...$event! })"
    label-class="text-base mb-0 font-bold !text-shori-gray-12"
    input-class="text-sm w-full"
  />
</template>
