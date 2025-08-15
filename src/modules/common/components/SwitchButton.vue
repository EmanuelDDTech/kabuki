<script lang="ts" setup>
interface Props {
  id: number;
  value: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: true,
});
defineEmits(['toggle']);
</script>

<template>
  <div class="text-center">
    <div
      class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
    >
      <input
        type="checkbox"
        :name="`toggle-${id}`"
        :id="`toggle-${id}`"
        class="toggle-checkbox absolute block !w-6 !h-6 !rounded-full bg-white border-4 !appearance-none transition"
        :class="{
          'opacity-50 cursor-not-allowed': disabled,
          'opacity-100 cursor-pointer': !disabled,
        }"
        :checked="value"
        :disabled="disabled"
        @change="$emit('toggle')"
      />
      <label
        :for="`toggle-${id}`"
        class="toggle-label block overflow-hidden !h-6 !rounded-full bg-gray-300 cursor-pointer"
      ></label>
    </div>
  </div>
</template>

<style scoped>
/* CHECKBOX TOGGLE SWITCH */
/* @apply rules for documentation, these do not work as inline style */
.toggle-checkbox {
  appearance: none !important;
}

.toggle-checkbox:checked {
  @apply: right-0 border-green-400;
  right: 0;
  border-color: #68d391;
}
.toggle-checkbox:checked + .toggle-label {
  @apply: bg-green-400;
  background-color: #68d391;
}
</style>
