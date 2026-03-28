import { defineStore } from 'pinia';
import { computed, inject, ref } from 'vue';
import type { Serie } from '../interfaces';
import { getSetsBySeriesIdAction } from '../actions';

export const useSerieStore = defineStore('serie', () => {
  const serie = ref<Serie | null>(null);
  const isLoading = ref(true);

  const toast: any = inject('toast');

  const getSerieById = async (serieId: string) => {
    isLoading.value = true;

    try {
      const data = await getSetsBySeriesIdAction(serieId);
      serie.value = data;
    } catch (error) {
      toast.error('Error al obtener la serie');
    } finally {
      isLoading.value = false;
    }
  };

  const clearSerie = () => {
    serie.value = null;
  };

  return {
    // State
    serie,
    isLoading,

    // Methods
    getSerieById,
    clearSerie,

    // Getters
    serieData: computed(() => serie.value),
  };
});
