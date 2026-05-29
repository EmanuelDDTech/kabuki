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
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div
        v-if="open"
        class="fixed inset-0 z-[190] bg-shori-gray-12/65 backdrop-blur-[2px]"
        @click="$emit('close')"
      ></div>
    </Transition>

    <Transition name="modal-panel">
      <div
        v-if="open"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <div
          class="w-full max-w-[560px] rounded-2xl border border-shori-gray-6 bg-shori-gray-1 text-shori-gray-12 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
        >
          <div class="px-6 py-5">
            <slot name="body" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 220ms ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-panel-enter-active,
.modal-panel-leave-active {
  transition:
    opacity 240ms ease,
    transform 240ms ease;
}

.modal-panel-enter-from,
.modal-panel-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
