<script setup lang="ts">
import CustomModal from '@/modules/common/components/CustomModal.vue';
import XMarkIcon from '@/modules/layouts/components/XMarkIcon.vue';

interface FilterOption {
  id: number | string;
  name: string;
  slug: string;
}

interface Props {
  open: boolean;
  title: string;
  options: FilterOption[];
  selectedValues: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  toggleOption: [slug: string];
}>();

const isSelected = (slug: string) => props.selectedValues.includes(slug);
</script>

<template>
  <CustomModal :open="open" @close="emit('close')">
    <template #body>
      <div class="w-full max-w-[560px]">
        <div class="mb-4 flex items-center justify-between border-b border-shori-gray-5 pb-3">
          <h3 class="truncate pr-3 text-xl font-bold text-shori-gray-12">{{ title }}</h3>
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-shori-gray-6 bg-shori-gray-2 text-shori-gray-11 transition-colors hover:bg-shori-gray-3"
            @click="emit('close')"
            aria-label="Cerrar modal"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>

        <div class="filter-options-scroll max-h-[62vh] space-y-1 overflow-y-auto pr-2">
          <label
            v-for="option in options"
            :key="option.id"
            :for="`modal-filter-${title}-${option.slug}`"
            class="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-shori-gray-6 hover:bg-shori-gray-3"
          >
            <span class="text-base leading-tight text-shori-gray-12">{{ option.name }}</span>
            <input
              :id="`modal-filter-${title}-${option.slug}`"
              type="checkbox"
              class="h-4 w-4 shrink-0 cursor-pointer accent-shori-green-9"
              :checked="isSelected(option.slug)"
              @change="emit('toggleOption', option.slug)"
            />
          </label>
        </div>
      </div>
    </template>
  </CustomModal>
</template>

<style scoped>
.filter-options-scroll {
  scrollbar-width: thin;
  scrollbar-color: var(--gray-8) transparent;
}

.filter-options-scroll::-webkit-scrollbar {
  width: 10px;
}

.filter-options-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.filter-options-scroll::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  border-radius: 9999px;
  background-clip: padding-box;
  background-color: var(--gray-8);
}

.filter-options-scroll::-webkit-scrollbar-thumb:hover {
  background-color: var(--gray-9);
}
</style>
