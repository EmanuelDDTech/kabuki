<template>
  <article
    class="relative rounded-[20px] border border-[color-mix(in_srgb,var(--gray-6)_82%,transparent)] bg-[color-mix(in_srgb,var(--gray-1)_88%,var(--gray-2))] shadow-[0_10px_20px_rgba(18,26,41,0.06)] p-4 pr-4 pl-[1.05rem] cursor-pointer transition-[border-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:border-shori-green-8"
    :class="selected ? 'border-shori-green-8 ring-2 ring-shori-green-8/25 shadow-md' : ''"
  >
    <h3 class="text-[1.08rem] font-bold text-shori-gray-12">Enviar a:</h3>

    <div class="mt-2.5 pr-9">
      <p class="text-shori-gray-11 leading-[1.35]">
        {{
          `${address.street}, ${address.colony}, ${address.city}, ${address.state}, ${address.zip}, ${address.country}`
        }}
      </p>
      <p class="mt-2 text-shori-gray-10 text-[0.88rem] font-semibold">Tel: {{ address.phone }}</p>
    </div>

    <EditIcon
      class="w-[1.35rem] absolute top-4 right-4 text-shori-gray-10 hover:text-shori-green-11"
      @click.stop="$emit('edit')"
    />
  </article>
</template>

<script lang="ts" setup>
import EditIcon from '@/modules/common/icons/EditIcon.vue';
import type { Address } from '../interfaces/address.interface';

interface Props {
  address: Address;
  selected: boolean;
}

defineProps<Props>();
</script>
