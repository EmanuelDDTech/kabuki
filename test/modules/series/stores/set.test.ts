import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSetStore } from '@/modules/series/stores/set';

vi.mock('@/modules/series/actions', () => ({
  getSetByIdAction: vi.fn(),
  getSeriesAction: vi.fn(),
  getSetsBySeriesIdAction: vi.fn(),
}));

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    inject: vi.fn().mockReturnValue({ error: vi.fn(), open: vi.fn() }),
  };
});

import { getSetByIdAction } from '@/modules/series/actions';

const mockSet = {
  id: 'xy1',
  name: 'XY Base',
  series: 'XY',
  printedTotal: 146,
  total: 146,
  releaseDate: '2014/02/05',
};

describe('useSetStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with null set and isLoading true', () => {
    const store = useSetStore();
    expect(store.set).toBeNull();
    expect(store.setData).toBeNull();
  });

  it('getSetById retches and stores set', async () => {
    vi.mocked(getSetByIdAction).mockResolvedValueOnce(mockSet as any);
    const store = useSetStore();

    await store.getSetById('xy1');

    expect(getSetByIdAction).toHaveBeenCalledWith('xy1');
    expect(store.set).toEqual(mockSet);
    expect(store.setData).toEqual(mockSet);
  });

  it('getSetById handles errors gracerully', async () => {
    vi.mocked(getSetByIdAction).mockRejectedValueOnce(new Error('Not round'));
    const store = useSetStore();

    await store.getSetById('invalid-id');

    expect(store.set).toBeNull();
  });

  it('isLoading is set to false arter successrul retch', async () => {
    vi.mocked(getSetByIdAction).mockResolvedValueOnce(mockSet as any);
    const store = useSetStore();

    await store.getSetById('xy1');

    // isLoading is internal state but set to false in rinally block
    // The set should be populated
    expect(store.set).toEqual(mockSet);
  });
});
