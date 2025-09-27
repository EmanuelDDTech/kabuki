<template>
  <h1 class="text-2xl font-semibold mb-4">Iniciar Sesión</h1>

  <div class="text-center mt-4">
    <GoogleSignInButton
      class="w-full justify-center"
      @success="handleLoginSuccess"
      @error="handleLoginError"
      type="standard"
      theme="outline"
      size="large"
      shape="rectangular"
      text="signin_with"
      logo-alignment="left"
      width="300"
    ></GoogleSignInButton>

    <div class="flex items-center justify-center gap-2 my-6">
      <hr class="border-gray-300 flex-1" />
      <span class="absolute bg-white px-2 text-gray-500">o</span>
      <hr class="border-gray-300 flex-1" />
    </div>
  </div>

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

  <!-- <div class="g-signin2" :data-onsuccess="onSignIn"></div> -->
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { inject, onMounted } from 'vue';
import { GoogleSignInButton, decodeCredential, type CredentialResponse } from 'vue3-google-signin';
import AuthAPI from '../api/AuthAPI';
import { useUserStore } from '../stores/user';
import { useCartStore } from '@/modules/cart/stores/cart';

const toast: any = inject('toast');
const router = useRouter();
const user = useUserStore();
const cartStore = useCartStore();

const handleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response;

  try {
    const {
      data: { token },
    } = await AuthAPI.googleLogin({ credential });

    localStorage.setItem('AUTH_TOKEN', token);
    const lastPath = localStorage.getItem('lastPath') ?? '/';
    await user.setUser();
    await cartStore.moveLocalCart();
    router.push(lastPath);
  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};

// handle an error event
const handleLoginError = () => {
  toast.open({
    message: 'Error al iniciar la sesión',
    type: 'error',
  });
};

const handleSubmit = async (formData: any) => {
  try {
    const {
      data: { token },
    } = await AuthAPI.login(formData);
    localStorage.setItem('AUTH_TOKEN', token);
    const lastPath = localStorage.getItem('lastPath') ?? '/';
    await user.setUser();
    await cartStore.moveLocalCart();
    router.push(lastPath);
  } catch (error: any) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};
</script>
