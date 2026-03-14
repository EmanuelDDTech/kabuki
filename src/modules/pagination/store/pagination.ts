import { useUrlSearchParams } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

type FetchFunction = (params: {
  offset: number;
  limit: number;
  page: number;
}) => Promise<{ items: any[]; total: number }>;

const DEFAULT_PAGE_SIZE = 8;

export const usePaginationStore = defineStore('pagination', () => {
  const params = useUrlSearchParams('history');

  const items = ref<any[]>([]);
  const total = ref(0);
  const loading = ref(false);

  const fetchFunction = ref<FetchFunction | null>(null);

  const page = ref<number>(Number(params.page) || 1);
  const pageSize = ref<number>(Number(params.pageSize) || DEFAULT_PAGE_SIZE);

  const hasMore = ref(true);

  const loadItems = async (reset = false) => {
    if (!fetchFunction.value || loading.value) return;

    loading.value = true;

    if (reset) {
      resetValues();
    }

    const offset = (page.value - 1) * pageSize.value;

    const result = await fetchFunction.value({
      offset,
      limit: pageSize.value,
      page: page.value,
    });

    if (page.value === 1) {
      items.value = result.items;
    } else {
      items.value.push(...result.items);
    }

    if (result.items.length < pageSize.value) hasMore.value = false;
    loading.value = false;
  };

  function setFetcher(fn: FetchFunction) {
    fetchFunction.value = fn;
  }

  function resetValues() {
    items.value = [];
    total.value = 0;
    page.value = 1;
    pageSize.value = DEFAULT_PAGE_SIZE;
    hasMore.value = true;
  }

  async function loadMore() {
    if (!hasMore.value || loading.value) return;
    page.value += 1;
    await loadItems();
  }

  return {
    items,
    total,
    loading,
    hasMore,

    loadItems,
    setFetcher,
    loadMore,

    resetValues,
  };
});
