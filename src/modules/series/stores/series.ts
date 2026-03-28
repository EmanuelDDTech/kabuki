import { defineStore } from 'pinia';
import { computed, inject, onMounted, ref } from 'vue';
import type { Serie } from '../interfaces';
import { getSeriesAction } from '../actions';
import { usePaginationStore } from '@/modules/pagination/store/pagination';

export const useSeriesStore = defineStore('series', () => {
  const series = ref<Serie[]>([]);
  const isLoading = ref(true);

  const paginationStore = usePaginationStore();

  const toast: any = inject('toast');

  const getSeries = async ({ page, limit }: { page: number; limit: number }) => {
    isLoading.value = true;
    try {
      const data = await getSeriesAction({ page, itemsPerPage: limit });

      series.value = data;

      return {
        items: data,
        total: data.length,
      };
    } catch (error) {
      toast.open({
        message: 'Error al obtener las series',
        type: 'error',
      });
      return {
        items: [],
        total: 0,
      };
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    paginationStore.setFetcher(getSeries);
    paginationStore.loadItems();
  });

  return {
    // State
    // series,
    isLoading,

    // Methods
    getSeries,

    // Getters
    seriesList: computed(() => series.value),
    seriesCount: computed(() => series.value.length),
  };
});
