<script lang="ts" setup>
import AdminFooter from '@/modules/admin/components/AdminFooter.vue';
import AdminSidebar from '@/modules/admin/components/AdminSidebar.vue';
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import { RouterView } from 'vue-router';

const isMobileSidebarOpen = shallowRef(false);

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
};

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false;
};

const handleViewportResize = () => {
  if (window.innerWidth >= 1024) {
    closeMobileSidebar();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMobileSidebar();
  }
};

watch(isMobileSidebarOpen, (isOpen) => {
  document.body.classList.toggle('overflow-hidden', isOpen);
});

onMounted(() => {
  window.addEventListener('resize', handleViewportResize);
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleViewportResize);
  window.removeEventListener('keydown', handleKeydown);
  document.body.classList.remove('overflow-hidden');
});
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="fixed top-5 right-5 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-shori-gray-3 text-shori-gray-11 transition-transform duration-300 active:scale-95 lg:hidden"
      aria-controls="sidebar"
      :aria-expanded="isMobileSidebarOpen"
      @click="toggleMobileSidebar"
    >
      <span class="sr-only">Abrir o cerrar menú lateral</span>
      <svg
        v-if="!isMobileSidebarOpen"
        class="h-6 w-6"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg
        v-else
        class="h-6 w-6"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileSidebarOpen"
        class="fixed inset-0 z-30 bg-black/40 lg:hidden"
        @click="closeMobileSidebar"
      ></div>
    </Transition>

    <div class="flex overflow-hidden bg-shori-gray-1">
      <AdminSidebar :is-mobile-open="isMobileSidebarOpen" @close-mobile="closeMobileSidebar" />

      <div
        id="main-content"
        class="h-full w-full bg-shori-gray-1 relative overflow-y-auto lg:ml-64 min-h-screen"
      >
        <RouterView />

        <AdminFooter />
      </div>
    </div>
  </div>
</template>

<style>
#static-footer {
  display: none;
}
</style>
