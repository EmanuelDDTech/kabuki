import { ref, onMounted, computed } from 'vue';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import AuthAPI from '../api/AuthAPI';
import type { User } from '../interfaces';

export const useUserStore = defineStore('user', () => {
  const router = useRouter();
  const user = ref<User | null>();

  const setUser = async () => {
    try {
      const { data } = await AuthAPI.auth();
      user.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  function logout() {
    localStorage.removeItem('AUTH_TOKEN');
    user.value = null;
    router.push({ name: 'login' });
  }

  const getUserName = computed(() => (user.value?.name ? user.value?.name : ''));
  const isSet = computed(() => (user.value ? true : false));

  return { user, getUserName, isSet, setUser, logout };
});
