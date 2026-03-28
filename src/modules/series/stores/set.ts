import { defineStore } from 'pinia';
import { computed, inject, ref } from 'vue';
import type { Set } from '../interfaces';
import { getSetByIdAction } from '../actions';

export const useSetStore = defineStore('set', () => {
  const set = ref<Set | null>(null);
  const isLoading = ref(true);

  const toast: any = inject('toast');

  async function getSetById(setId: string) {
    isLoading.value = true;

    try {
      const data = await getSetByIdAction(setId);
      set.value = data;
    } catch (error) {
      toast.error('Error al obtener la expansión');
    } finally {
      isLoading.value = false;
    }
  }

  function clearSet() {
    set.value = null;
  }

  return {
    // State
    set,
    isLoading,

    // Methods
    getSetById,
    clearSet,

    // Getters
    setData: computed(() => set.value),
  };
});
