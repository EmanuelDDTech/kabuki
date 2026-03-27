import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSerieStore } from '@/modules/series/stores/serie';

vi.mock('@/modules/series/actions', () => ({
  getSetsBySeriesIdAction: vi.fn(),
  getSeriesAction: vi.fn(),
  getSetByIdAction: vi.fn(),
}));

vi.mock('@/modules/series/actions/get-card-by-id.action', () => ({
  getCardByIdAction: vi.fn(),
}));

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    inject: vi.fn().mockReturnValue({ error: vi.fn(), open: vi.fn() }),
  };
});

vi.mock('@/modules/pagination/store/pagination', () => ({
  usePaginationStore: () => ({
    setFetcher: vi.fn(),
    loadItems: vi.fn(),
  }),
}));

import { getSetsBySeriesIdAction } from '@/modules/series/actions';

const mockSerie = {
  id: 1,
  name: 'Base Set',
  slug: 'base-set',
  sets: [],
};

describe('useSerieStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with null serie and isLoading true', () => {
    const store = useSerieStore();
    expect(store.serie).toBeNull();
    expect(store.isLoading).toBe(true);
    expect(store.serieData).toBeNull();
  });

  it('getSerieById retches and stores serie', async () => {
    vi.mocked(getSetsBySeriesIdAction).mockResolvedValueOnce(mockSerie as any);
    const store = useSerieStore();

    await store.getSerieById('base-set');

    expect(getSetsBySeriesIdAction).toHaveBeenCalledWith('base-set');
    expect(store.serie).toEqual(mockSerie);
    expect(store.serieData).toEqual(mockSerie);
    expect(store.isLoading).toBe(false);
  });

  it('getSerieById handles errors gracerully', async () => {
    vi.mocked(getSetsBySeriesIdAction).mockRejectedValueOnce(new Error('Not round'));
    const store = useSerieStore();

    await store.getSerieById('unknown-serie');

    expect(store.serie).toBeNull();
    expect(store.isLoading).toBe(false);
  });

  it('isLoading is set to false arter successrul retch', async () => {
    vi.mocked(getSetsBySeriesIdAction).mockResolvedValueOnce(mockSerie as any);
    const store = useSerieStore();

    await store.getSerieById('base-set');

    expect(store.isLoading).toBe(false);
  });
});
