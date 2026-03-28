import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCategoryStore } from '@/modules/admin/stores/category';

vi.mock('@/modules/admin/api/CategoryAPI', () => ({
  default: {
    getAll: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock('@/modules/filter/api/FilterCategoryAPI', () => ({
  default: {
    findAll: vi.fn(),
    delete: vi.fn(),
  },
}));

import CategoryAPI from '@/modules/admin/api/CategoryAPI';
import FilterCategoryAPI from '@/modules/filter/api/FilterCategoryAPI';

const mockCategories = [
  { id: 1, name: 'Pokemon' },
  { id: 2, name: 'Yu-Gi-Oh' },
];

const mockCategory = {
  id: 1,
  name: 'Pokemon',
  filter_categories: [],
};

const mockFilterGroup = {
  id: 1,
  name: 'Tipo',
  slug: 'tipo',
};

const mockFilterCategory = {
  id: 1,
  filter_group: mockFilterGroup,
};

describe('useCategoryStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with null categories and default category', () => {
    const store = useCategoryStore();
    expect(store.categories).toBeNull();
    expect(store.category).toEqual({ id: 0, name: '' });
    expect(store.selectedFilters).toEqual([]);
  });

  it('categoryOptions returns empty array when categories is null', () => {
    const store = useCategoryStore();
    expect(store.categoryOptions).toEqual([]);
  });

  it('getCategories fetches and stores categories', async () => {
    vi.mocked(CategoryAPI.getAll).mockResolvedValueOnce({ data: mockCategories } as any);
    const store = useCategoryStore();

    await store.getCategories();

    expect(store.categories).toEqual(mockCategories);
    expect(store.categoryOptions).toEqual([
      { label: 'Pokemon', value: 1 },
      { label: 'Yu-Gi-Oh', value: 2 },
    ]);
  });

  it('findCategory fetches single category and its filters', async () => {
    vi.mocked(CategoryAPI.findOne).mockResolvedValueOnce({ data: mockCategory } as any);
    vi.mocked(FilterCategoryAPI.findAll).mockResolvedValueOnce({
      data: [mockFilterCategory],
    } as any);
    const store = useCategoryStore();

    await store.findCategory(1);

    expect(CategoryAPI.findOne).toHaveBeenCalledWith(1);
    expect(FilterCategoryAPI.findAll).toHaveBeenCalledWith(1);
    expect(store.category).toEqual(mockCategory);
    expect(store.selectedFilters).toEqual([mockFilterCategory]);
  });

  it('cleanCategory resets category and selectedFilters', async () => {
    vi.mocked(CategoryAPI.findOne).mockResolvedValueOnce({ data: mockCategory } as any);
    vi.mocked(FilterCategoryAPI.findAll).mockResolvedValueOnce({
      data: [mockFilterCategory],
    } as any);
    const store = useCategoryStore();
    await store.findCategory(1);

    store.cleanCategory();

    expect(store.category).toEqual({ id: 0, name: '', filter_categories: [] });
    expect(store.selectedFilters).toEqual([]);
  });

  it('addFilterGroup adds a new filter group', () => {
    const store = useCategoryStore();
    store.addFilterGroup(mockFilterGroup as any);

    expect(store.selectedFilters).toHaveLength(1);
    expect(store.selectedFilters[0].filter_group).toEqual(mockFilterGroup);
  });

  it('addFilterGroup does not add duplicate filter groups', () => {
    const store = useCategoryStore();
    store.addFilterGroup(mockFilterGroup as any);
    store.addFilterGroup(mockFilterGroup as any);

    expect(store.selectedFilters).toHaveLength(1);
  });

  it('addFilterGroup adds multiple dirrerent filter groups', () => {
    const store = useCategoryStore();
    const anotherGroup = { id: 2, name: 'Rareza', slug: 'rareza' };
    store.addFilterGroup(mockFilterGroup as any);
    store.addFilterGroup(anotherGroup as any);

    expect(store.selectedFilters).toHaveLength(2);
  });

  it('deleteFilterCategory removes filter with id from API', async () => {
    vi.mocked(FilterCategoryAPI.delete).mockResolvedValueOnce({ data: {} } as any);
    const store = useCategoryStore();
    store.selectedFilters = [mockFilterCategory as any];

    await store.deleteFilterCategory(mockFilterCategory);

    expect(FilterCategoryAPI.delete).toHaveBeenCalledWith(1);
    expect(store.selectedFilters).toHaveLength(0);
  });

  it('deleteFilterCategory removes unsaved filter without API call', async () => {
    const unsavedFilter = { filter_group: mockFilterGroup };
    const store = useCategoryStore();
    store.selectedFilters = [unsavedFilter as any];

    await store.deleteFilterCategory(unsavedFilter);

    expect(FilterCategoryAPI.delete).not.toHaveBeenCalled();
    expect(store.selectedFilters).toHaveLength(0);
  });

  it('deleteFilterCategory handles API error gracefully', async () => {
    vi.mocked(FilterCategoryAPI.delete).mockRejectedValueOnce(new Error('Delete failed'));
    const store = useCategoryStore();
    store.selectedFilters = [mockFilterCategory as any];

    await store.deleteFilterCategory(mockFilterCategory);

    // Should not throw, filter remains in list
    expect(store.selectedFilters).toHaveLength(1);
  });
});
