<template>
  <h1 class="text-2xl font-semibold mb-4">Iniciar Sesión</h1>

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

  <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError"></GoogleSignInButton>
  <!-- <div class="g-signin2" :data-onsuccess="onSignIn"></div> -->
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { inject, onMounted } from 'vue';
import { GoogleSignInButton, decodeCredential, type CredentialResponse } from 'vue3-google-signin';
import AuthAPI from '../api/AuthAPI';
import { useUserStore } from '../stores/user';

const toast: any = inject('toast');
const router = useRouter();

const handleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response;

  try {
    const {
      data: { token },
    } = await AuthAPI.googleLogin({ credential });

    localStorage.setItem('AUTH_TOKEN', token);
    const lastPath = localStorage.getItem('lastPath') ?? '/';
    const user = useUserStore();
    await user.setUser();
    router.push(lastPath);
  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
  console.log('Access Token', credential);
  console.log('User: ', decodeCredential(credential));
};

// handle an error event
const handleLoginError = () => {
  console.error('Login failed');
};

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
</script>
