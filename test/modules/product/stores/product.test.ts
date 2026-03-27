import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ path: '/products/1', params: { id: '1' }, query: {} }),
}));

vi.mock('@/modules/product/api/ProductAPI', () => ({
  default: {
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    search: vi.fn(),
  },
}));

vi.mock('@/modules/filter/store/filterCategory', () => ({
  useFilterCategoryStore: () => ({
    filters: [],
    selectedFilters: [],
    findFilters: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock('@/modules/admin/api/FilterValueProductAPI', () => ({
  default: {
    save: vi.fn(),
    findByProductId: vi.fn(),
  },
}));

vi.mock('@/modules/product/api/ProductGalleryAPI', () => ({
  default: {
    findByProductId: vi.fn(),
    updateGallery: vi.fn(),
  },
}));

import ProductAPI from '@/modules/product/api/ProductAPI';
import FilterValueProductAPI from '@/modules/admin/api/FilterValueProductAPI';
import ProductGalleryAPI from '@/modules/product/api/ProductGalleryAPI';
import { useProductStore } from '@/modules/product/stores/product';

const mockProductData = {
  id: 1,
  name: 'Charizard',
  sku: 'CHAR-001',
  description: 'Fire-breathing dragon',
  price: 500,
  weight: 0.05,
  discount: 0,
  stock: 10,
  stock_visible: true,
  product_category_id: 1,
  active: true,
  campaign_products: [],
};

const mockGallery = [{ id: 1, url: 'https://example.com/charizard.jpg', order: 0 }];
const mockFilters = [1, 2, 3];

describe('useProductStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const store = useProductStore();
    expect(store.id).toBe(0);
    expect(store.name).toBe('');
    expect(store.price).toBe(0);
    expect(store.stock).toBe(0);
    expect(store.gallery).toEqual([]);
    expect(store.filters).toEqual([]);
    expect(store.searchQuery).toBe('');
    expect(store.searchedProducts).toEqual([]);
  });

  it('cleanProduct resets all product fields', () => {
    const store = useProductStore();
    store.name = 'Test';
    store.price = 500;
    store.stock = 10;

    store.cleanProduct();

    expect(store.name).toBe('');
    expect(store.price).toBe(0);
    expect(store.stock).toBe(0);
    expect(store.id).toBe(0);
  });

  it('findProduct fetches and sets product data', async () => {
    vi.mocked(ProductAPI.findById).mockResolvedValueOnce({ data: mockProductData } as any);
    vi.mocked(ProductGalleryAPI.findByProductId).mockResolvedValueOnce({ data: mockGallery } as any);
    vi.mocked(FilterValueProductAPI.findByProductId).mockResolvedValueOnce({ data: mockFilters } as any);
    const store = useProductStore();

    await store.findProduct(1);

    expect(store.id).toBe(1);
    expect(store.name).toBe('Charizard');
    expect(store.price).toBe(500);
    expect(store.stock).toBe(10);
    expect(store.gallery).toEqual(mockGallery);
    expect(store.filters).toEqual(mockFilters);
  });

  it('findProduct sets discount from campaign_products', async () => {
    const productWithDiscount = {
      ...mockProductData,
      campaign_products: [{ campaign_price: 400 }],
    };
    vi.mocked(ProductAPI.findById).mockResolvedValueOnce({ data: productWithDiscount } as any);
    vi.mocked(ProductGalleryAPI.findByProductId).mockResolvedValueOnce({ data: [] } as any);
    vi.mocked(FilterValueProductAPI.findByProductId).mockResolvedValueOnce({ data: [] } as any);
    const store = useProductStore();

    await store.findProduct(1);

    expect(store.discount).toBe(400);
  });

  it('findProduct handles errors gracefully', async () => {
    vi.mocked(ProductAPI.findById).mockRejectedValueOnce(new Error('Not found'));
    const store = useProductStore();

    await store.findProduct(999);

    expect(store.id).toBe(0);
  });

  it('create calls ProductAPI.create and sets id', async () => {
    vi.mocked(ProductAPI.create).mockResolvedValueOnce({ data: { ...mockProductData, id: 5 } } as any);
    const store = useProductStore();

    const result = await store.create({ name: 'New Card', price: 100 });

    expect(ProductAPI.create).toHaveBeenCalled();
    expect(store.id).toBe(5);
    expect(result).toMatchObject({ id: 5 });
  });

  it('selectFilter adds filter id when not present', () => {
    const store = useProductStore();
    store.selectFilter(1);
    expect(store.filters).toContain(1);
  });

  it('selectFilter removes filter id when already present', () => {
    const store = useProductStore();
    store.selectFilter(1);
    store.selectFilter(1);
    expect(store.filters).not.toContain(1);
  });

  it('clearFilters empties filters array', () => {
    const store = useProductStore();
    store.selectFilter(1);
    store.selectFilter(2);

    store.clearFilters();

    expect(store.filters).toEqual([]);
  });

  it('clearSearchQuery resets searchQuery', () => {
    const store = useProductStore();
    store.searchQuery = 'Pikachu';

    store.clearSearchQuery();

    expect(store.searchQuery).toBe('');
  });

  it('searchProducts clears results when query is empty', async () => {
    const store = useProductStore();
    store.searchedProducts = [mockProductData as any];
    store.searchQuery = '';

    await store.searchProducts();

    expect(store.searchedProducts).toEqual([]);
    expect(ProductAPI.search).not.toHaveBeenCalled();
  });

  it('searchProducts fetches products when query is not empty', async () => {
    vi.mocked(ProductAPI.search).mockResolvedValueOnce({ data: [mockProductData] } as any);
    const store = useProductStore();
    store.searchQuery = 'Pikachu';

    await store.searchProducts();

    expect(ProductAPI.search).toHaveBeenCalledWith('Pikachu', false);
    expect(store.searchedProducts).toEqual([mockProductData]);
  });

  it('saveFilters calls FilterValueProductAPI.save with correct data', async () => {
    vi.mocked(FilterValueProductAPI.save).mockResolvedValueOnce({} as any);
    const store = useProductStore();
    store.id = 5;
    store.selectFilter(1);
    store.selectFilter(2);

    await store.saveFilters();

    expect(FilterValueProductAPI.save).toHaveBeenCalledWith({
      productId: 5,
      filters: [1, 2],
    });
  });
});
