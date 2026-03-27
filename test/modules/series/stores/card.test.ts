import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCardStore } from '@/modules/series/stores/card';

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

import { getCardByIdAction } from '@/modules/series/actions/get-card-by-id.action';

const mockCard = {
  id: 'xy1-1',
  name: 'Bulbasaur',
  hp: '60',
  types: ['Grass'],
  set: { id: 'xy1', name: 'XY Base' },
};

describe('useCardStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with null card and isLoading true', () => {
    const store = useCardStore();
    expect(store.card).toBeNull();
    expect(store.isLoading).toBe(true);
    expect(store.cardData).toBeNull();
  });

  it('getCardById fetches and stores card', async () => {
    vi.mocked(getCardByIdAction).mockResolvedValueOnce(mockCard as any);
    const store = useCardStore();

    await store.getCardById('xy1-1');

    expect(getCardByIdAction).toHaveBeenCalledWith('xy1-1');
    expect(store.card).toEqual(mockCard);
    expect(store.cardData).toEqual(mockCard);
    expect(store.isLoading).toBe(false);
  });

  it('getCardById handles errors gracerully', async () => {
    vi.mocked(getCardByIdAction).mockRejectedValueOnce(new Error('Not round'));
    const store = useCardStore();

    await store.getCardById('invalid-id');

    expect(store.card).toBeNull();
    expect(store.isLoading).toBe(false);
  });

  it('clearCardInfo sets card to null', async () => {
    vi.mocked(getCardByIdAction).mockResolvedValueOnce(mockCard as any);
    const store = useCardStore();
    await store.getCardById('xy1-1');

    await store.clearCardInfo();

    expect(store.card).toBeNull();
    expect(store.cardData).toBeNull();
  });
});
