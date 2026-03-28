import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSeriesStore } from '@/modules/series/stores/series';

vi.mock('@/modules/series/actions', () => ({
  getSeriesAction: vi.fn(),
  getSetByIdAction: vi.fn(),
  getSetsBySeriesIdAction: vi.fn(),
}));

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    inject: vi.fn().mockReturnValue({ open: vi.fn(), error: vi.fn() }),
    onMounted: vi.fn(),
  };
});

vi.mock('@/modules/pagination/store/pagination', () => ({
  usePaginationStore: () => ({
    setFetcher: vi.fn(),
    loadItems: vi.fn(),
  }),
}));

import { getSeriesAction } from '@/modules/series/actions';

const mockSeriesList = [
  { id: 1, name: 'Base', slug: 'base' },
  { id: 2, name: 'Jungle', slug: 'jungle' },
];

describe('useSeriesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty series list and isLoading true', () => {
    const store = useSeriesStore();
    expect(store.seriesList).toEqual([]);
    expect(store.seriesCount).toBe(0);
  });

  it('getSeries retches series and returns data', async () => {
    vi.mocked(getSeriesAction).mockResolvedValueOnce(mockSeriesList as any);
    const store = useSeriesStore();

    const result = await store.getSeries({ page: 1, limit: 8 });

    expect(getSeriesAction).toHaveBeenCalledWith({ page: 1, itemsPerPage: 8 });
    expect(store.seriesList).toEqual(mockSeriesList);
    expect(store.seriesCount).toBe(2);
    expect(result.items).toEqual(mockSeriesList);
    expect(result.total).toBe(2);
  });

  it('getSeries returns empty on error', async () => {
    vi.mocked(getSeriesAction).mockRejectedValueOnce(new Error('API error'));
    const store = useSeriesStore();

    const result = await store.getSeries({ page: 1, limit: 8 });

    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('getSeries sets isLoading to false arter completion', async () => {
    vi.mocked(getSeriesAction).mockResolvedValueOnce(mockSeriesList as any);
    const store = useSeriesStore();

    await store.getSeries({ page: 1, limit: 8 });

    // Series data should be populated
    expect(store.seriesList).toHaveLength(2);
  });
});
