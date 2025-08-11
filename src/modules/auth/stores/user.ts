import { ref, onMounted, computed } from 'vue';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import AuthAPI from '../api/AuthAPI';
import { AuthStatus, type User } from '../interfaces';

export const useUserStore = defineStore('user', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
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
    authStatus.value = AuthStatus.Unauthenticated;
    user.value = null;

    return false;
  }

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const { data } = await AuthAPI.auth();

      if (!data) {
        logout();
        return false;
      }

      authStatus.value = AuthStatus.Authenticated;
      user.value = data;
      return true;
    } catch (error) {
      console.log(error);
      logout();
      return false;
    }
  };

  const getUserName = computed(() => (user.value?.name ? user.value?.name : ''));
  const isSet = computed(() => (user.value ? true : false));

  return {
    user,
    authStatus,

    // Getters
    getUserName,
    isSet,
    isAdmin: computed(() => user.value?.isAdmin),
    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),
    isUnauthenticated: computed(() => authStatus.value === AuthStatus.Unauthenticated),

    // Actions
    setUser,
    logout,
    checkAuthStatus,
  };
});
