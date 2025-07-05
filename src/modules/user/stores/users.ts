import type { User } from '@/modules/auth/interfaces';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import userAPI from '../api/userAPI';

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]);
  const user = ref<User>();

  const getUsers = async () => {
    try {
      const { data } = await userAPI.getAll();
      users.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  const getUserById = async (userId: number) => {
    try {
      const { data } = await userAPI.getById(userId);
      user.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    user,

    // Methods
    getUsers,
    getUserById,

    // Getters
    userList: computed(() => [...users.value]),
    noUsers: computed(() => users.value.length === 0),

    userData: computed(() => user.value),
    emptyCart: computed(() => user.value?.carts.length === 0),
  };
});
