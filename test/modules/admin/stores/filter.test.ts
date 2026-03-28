import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFilterStore } from '@/modules/admin/stores/filter';

vi.mock('@/modules/filter/api/FilterGroupAPI', () => ({
  default: {
    getAll: vi.fn(),
  },
}));

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    onMounted: vi.fn(),
  };
});

describe('useFilterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty filterGroups', () => {
    const store = useFilterStore();
    expect(store.filterGroups).toEqual([]);
  });
});
