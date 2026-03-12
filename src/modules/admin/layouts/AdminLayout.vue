<script lang="ts" setup>
import AdminFooter from '@/modules/admin/components/AdminFooter.vue';
import AdminHeader from '@/modules/admin/components/AdminHeader.vue';
import AdminSidebar from '@/modules/admin/components/AdminSidebar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <!-- component -->
  <!-- This is an example component -->
  <div>
    <AdminHeader />

    <div class="flex overflow-hidden bg-shori-gray-1 pt-16">
      <AdminSidebar />

      <div class="bg-gray-900 opacity-50 hidden fixed inset-0 z-10" id="sidebarBackdrop"></div>
      <div
        id="main-content"
        class="h-full w-full bg-shori-gray-2 relative overflow-y-auto lg:ml-64 min-h-screen"
      >
        <RouterView />

        <AdminFooter />
      </div>
    </div>
    <!-- <script async defer src="https://buttons.github.io/buttons.js"></script>
   <script src="https://demo.themesberg.com/windster/app.bundle.js"></script> -->
  </div>
</template>

<style>
#static-footer {
  display: none;
}
</style>
