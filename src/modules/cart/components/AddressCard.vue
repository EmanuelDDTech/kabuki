<template>
  <article
    class="shadow hover:shadow-blue-600 relative p-3 rounded border hover:border-blue-500 cursor-pointer"
    :class="selected ? 'shadow-blue-600 border-blue-500' : 'border-shori-gray-6'"
  >
    <h3 class="font-bold text-xl mb-3">Enviar a:</h3>

    <div>
      <p class="text-shori-gray-11">
        {{
          `${address.street}, ${address.colony}, ${address.city}, ${address.state}, ${address.zip}, ${address.country}`
        }}
      </p>
    </div>

    <EditIcon
      class="w-7 absolute top-3 right-3 cursor-pointer hover:text-blue-600"
      @click="$emit('edit')"
    />
  </article>
</template>

<script lang="ts" setup>
import EditIcon from '@/modules/common/icons/EditIcon.vue';
import type { Address } from '../interfaces/address.interface';

interface Props {
  address: Address;
  selected: Boolean;
}

defineProps<Props>();
</script>
