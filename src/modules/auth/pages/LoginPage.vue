<template>
  <h1 class="text-2xl font-semibold mb-4">Iniciar Sesión</h1>
  <!-- <form action="#" method="POST">
    <div class="mb-4">
      <label for="email" class="block text-gray-600">Email</label>
      <input
        type="text"
        id="email"
        name="email"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <div class="mb-4">
      <label for="password" class="block text-gray-600">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <div class="mb-4 flex items-center">
      <input type="checkbox" id="remember" name="remember" class="text-blue-500" />
      <label for="remember" class="text-gray-600 ml-2">Remember Me</label>
    </div>
    <div class="mb-6 text-blue-500">
      <a href="#" class="hover:underline">Forgot Password?</a>
    </div>
    <button
      @click="onLogin"
      type="button"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
    >
      Login
    </button>
  </form> -->

  <FormKit
    id="loginForm"
    type="form"
    :actions="false"
    incomplete-message="No se pudo enviar, revisa las notificaciones"
    @submit="handleSubmit"
  >
    <FormKit
      type="email"
      label="Email"
      name="email"
      placeholder="Email de Usuario"
      validation="required|email"
      :validation-messages="{
        required: 'El email es obligatorio',
        email: 'Email no válido',
      }"
    />

    <FormKit
      type="password"
      label="Password"
      name="password"
      placeholder="Password de Usuario"
      validation="required"
      :validation-messages="{
        required: 'El password es obligatorio',
      }"
    />

    <FormKit type="submit">Iniciar Sesión</FormKit>
  </FormKit>

  <div class="mt-6 text-blue-500 text-center">
    <RouterLink :to="{ name: 'register' }" class="hover:underline">Sign up Here</RouterLink>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { inject } from 'vue';
import { reset } from '@formkit/vue';
import AuthAPI from '../api/AuthAPI';
import { useUserStore } from '../stores/user';

const toast: any = inject('toast');
const router = useRouter();

const handleSubmit = async (formData: any) => {
  try {
    const {
      data: { token },
    } = await AuthAPI.login(formData);
    localStorage.setItem('AUTH_TOKEN', token);
    const lastPath = localStorage.getItem('lastPath') ?? '/';
    const user = useUserStore();
    await user.setUser();
    router.push(lastPath);
  } catch (error: any) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};

// const onLogin = () => {
//   localStorage.setItem('userId', 'ABC-123');

//   const lastPath = localStorage.getItem('lastPath') ?? '/';

//   // router.replace({
//   //   name: 'home',
//   // });
//   localStorage.setItem('lastPath', '/');
//   router.replace(lastPath);
// };
</script>
