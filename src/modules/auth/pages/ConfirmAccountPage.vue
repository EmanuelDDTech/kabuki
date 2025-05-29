<template>
  <div class="relative flex flex-col items-center justify-center overflow-hidden">
    <div class="max-w-xl px-5 text-center">
      <h2 class="mb-2 text-[42px] font-bold text-zinc-800">Verificando el token</h2>
      <p class="mb-2 text-lg text-zinc-500">{{ verificationMessage }}</p>
      <!-- <a
        href="/login"
        class="mt-3 inline-block w-96 rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
        >Open the App →</a
      > -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthAPI from '../api/AuthAPI';

const verificationMessage = ref<string>('');

const toast: any = inject('toast');
const route = useRoute();
const router = useRouter();
const { token } = route.params;

onMounted(async () => {
  try {
    const { data } = await AuthAPI.verifyAccount(token);

    verificationMessage.value = 'El token se validó correctamente, serás redireccionado al login.';

    toast.open({
      message: data.msg,
      type: 'success',
    });
    setTimeout(() => {
      router.push({ name: 'login' });
    }, 3000);
  } catch (error: any) {
    verificationMessage.value = 'El token no es válido.';

    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
});
</script>
