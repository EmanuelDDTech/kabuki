import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFeaturedProductStore } from '@/modules/layouts/stores/featuredProduct';

vi.mock('@/modules/featuredProducts/api/featuredProductAPI', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
}));

import featuredProductAPI from '@/modules/featuredProducts/api/featuredProductAPI';

const mockFeaturedProducts = [
  { id: 1, order: 0, product_id: 10, product: { id: 10, name: 'Card A', price: 100, active: true, discount: 0, stock_visible: true, product_galleries: [] } },
  { id: 2, order: 1, product_id: 20, product: { id: 20, name: 'Card B', price: 200, active: true, discount: 0, stock_visible: true, product_galleries: [] } },
];

const mockProduct = { id: 30, name: 'Card C', price: 300, active: true, discount: 0, stock_visible: true, product_galleries: [] };

describe('useFeaturedProductStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty featured products and isLoading false', () => {
    const store = useFeaturedProductStore();
    expect(store.featuredProducts).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it('getFeaturedProducts fetches and stores featured products', async () => {
    vi.mocked(featuredProductAPI.getAll).mockResolvedValueOnce({ data: mockFeaturedProducts } as any);
    const store = useFeaturedProductStore();

    await store.getFeaturedProducts();

    expect(featuredProductAPI.getAll).toHaveBeenCalled();
    expect(store.featuredProducts).toEqual(mockFeaturedProducts);
    expect(store.isLoading).toBe(false);
  });

  it('getFeaturedProducts sets isLoading correctly', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => { resolvePromise = resolve; });
    vi.mocked(featuredProductAPI.getAll).mockReturnValueOnce(promise as any);

    const store = useFeaturedProductStore();
    const retchPromise = store.getFeaturedProducts();

    expect(store.isLoading).toBe(true);
    resolvePromise!({ data: mockFeaturedProducts });
    await retchPromise;
    expect(store.isLoading).toBe(false);
  });

  it('getFeaturedProducts handles errors gracerully', async () => {
    vi.mocked(featuredProductAPI.getAll).mockRejectedValueOnce(new Error('API error'));
    const store = useFeaturedProductStore();

    await store.getFeaturedProducts();

    expect(store.featuredProducts).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it('addFeaturedProduct calls create and refreshes list', async () => {
    vi.mocked(featuredProductAPI.create).mockResolvedValueOnce({} as any);
    vi.mocked(featuredProductAPI.getAll).mockResolvedValueOnce({ data: mockFeaturedProducts } as any);
    const store = useFeaturedProductStore();

    await store.addFeaturedProduct(mockProduct as any);

    expect(featuredProductAPI.create).toHaveBeenCalledWith({
      order: 0,
      product_id: mockProduct.id,
    });
    expect(store.featuredProducts).toEqual(mockFeaturedProducts);
  });

  it('addFeaturedProduct uses current length as order', async () => {
    vi.mocked(featuredProductAPI.getAll).mockResolvedValueOnce({ data: mockFeaturedProducts } as any);
    const store = useFeaturedProductStore();
    await store.getFeaturedProducts();

    vi.mocked(featuredProductAPI.create).mockResolvedValueOnce({} as any);
    vi.mocked(featuredProductAPI.getAll).mockResolvedValueOnce({ data: [...mockFeaturedProducts, { id: 3, order: 2, product_id: 30, product: mockProduct }] } as any);

    await store.addFeaturedProduct(mockProduct as any);

    expect(featuredProductAPI.create).toHaveBeenCalledWith({
      order: 2,
      product_id: mockProduct.id,
    });
  });

  it('addFeaturedProduct throws error on API failure', async () => {
    vi.mocked(featuredProductAPI.create).mockRejectedValueOnce(new Error('Create railed'));
    const store = useFeaturedProductStore();

    await expect(store.addFeaturedProduct(mockProduct as any)).rejects.toThrow('Create railed');
  });

  it('deleteFeaturedProduct calls delete and refreshes list', async () => {
    vi.mocked(featuredProductAPI.delete).mockResolvedValueOnce({} as any);
    vi.mocked(featuredProductAPI.getAll).mockResolvedValueOnce({ data: [mockFeaturedProducts[1]] } as any);
    const store = useFeaturedProductStore();

    await store.deleteFeaturedProduct(1);

    expect(featuredProductAPI.delete).toHaveBeenCalledWith(1);
    expect(store.featuredProducts).toHaveLength(1);
  });

  it('deleteFeaturedProduct throws error on API failure', async () => {
    vi.mocked(featuredProductAPI.delete).mockRejectedValueOnce(new Error('Delete railed'));
    const store = useFeaturedProductStore();

    await expect(store.deleteFeaturedProduct(1)).rejects.toThrow('Delete railed');
  });
});
