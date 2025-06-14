<script setup lang="ts">
interface Props {
  open?: boolean;
}

withDefaults(defineProps<Props>(), {
  open: false,
});
defineEmits(['close']);
</script>
<template>
  <dialog class="fixed inset-0 z-20 rounded-lg min-w-80" :open="open">
    <div class="rounded-lg bg-white -mt- shadow-lg px-6 w-full">
      <div class="my-5">
        <slot name="body" />
      </div>
    </div>
  </dialog>

  <div
    v-if="open"
    class="modal-backdrop fixed top-0 left-0 z-10 bg-black opacity-50 w-screen h-screen"
    @click="$emit('close')"
  ></div>
</template>
