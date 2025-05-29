<template>
  <!-- component -->
  <div class="bg-gray-100 flex flex-col justify-center items-center h-auto h-screen relative">
    <!-- Left: Image -->
    <div class="w-full sm:h-screen flex items-start overflow-hidden">
      <img src="@assets/img/login-image.webp" alt="Placeholder Image" class="object-cover w-full" />
    </div>
    <!-- Right: Login Form -->
    <div class="sm:p-16 p-8 w-full sm:w-[500px] sm:absolute bg-white rounded-xl">
      <RouterView />
    </div>
  </div>
</template>
