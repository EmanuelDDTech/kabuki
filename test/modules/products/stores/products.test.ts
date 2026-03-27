import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProductsStore } from '@/modules/products/stores/products';

vi.mock('@/modules/products/api/productsAPI', () => ({
  default: {
    findProductsAdmin: vi.fn(),
    findProducts: vi.fn(),
  },
}));

vi.mock('@/modules/product/api/ProductAPI', () => ({
  default: {
    update: vi.fn(),
    findById: vi.fn(),
  },
}));

import ProductsAPI from '@/modules/products/api/productsAPI';
import ProductAPI from '@/modules/product/api/ProductAPI';

const mockProduct = {
  id: 1,
  name: 'Test Card',
  sku: 'TC-001',
  active: true,
  price: 100,
  discount: 0,
  stock: 10,
  stock_visible: true,
  product_galleries: [],
};

const mockProductResponse = {
  data: [mockProduct],
  total: 1,
  page: 1,
  lastPage: 1,
};

describe('useProductsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty products and isLoading true', () => {
    const store = useProductsStore();
    expect(store.products).toEqual([]);
    expect(store.isLoading).toBe(true);
    expect(store.areProducts).toBe(false);
  });

  it('getProducts fetches admin products and updates state', async () => {
    vi.mocked(ProductsAPI.findProductsAdmin).mockResolvedValueOnce({
      data: mockProductResponse,
    } as any);
    const store = useProductsStore();

    const result = await store.getProducts('?page=1');

    expect(ProductsAPI.findProductsAdmin).toHaveBeenCalledWith('?page=1');
    expect(store.products).toEqual([mockProduct]);
    expect(store.isLoading).toBe(false);
    expect(store.areProducts).toBe(true);
    expect(result).toEqual(mockProductResponse);
  });

  it('getProductsWithFilters fetches filtered products', async () => {
    vi.mocked(ProductsAPI.findProducts).mockResolvedValueOnce({
      data: mockProductResponse,
    } as any);
    const store = useProductsStore();

    const result = await store.getProductsWithFilters('?category=1');

    expect(ProductsAPI.findProducts).toHaveBeenCalledWith('?category=1');
    expect(store.products).toEqual([mockProduct]);
    expect(store.isLoading).toBe(false);
    expect(result).toEqual(mockProductResponse);
  });

  it('clearProducts empties the products array', async () => {
    vi.mocked(ProductsAPI.findProductsAdmin).mockResolvedValueOnce({
      data: mockProductResponse,
    } as any);
    const store = useProductsStore();
    await store.getProducts('');

    store.clearProducts();

    expect(store.products).toEqual([]);
    expect(store.areProducts).toBe(false);
  });

  it('updateProduct calls ProductAPI.update', async () => {
    vi.mocked(ProductAPI.update).mockResolvedValueOnce({ data: mockProduct } as any);
    const store = useProductsStore();
    const updateData = { name: 'Updated Card' };

    await store.updateProduct(1, updateData);

    expect(ProductAPI.update).toHaveBeenCalledWith(1, updateData);
  });

  it('updateProduct throws error on failure', async () => {
    vi.mocked(ProductAPI.update).mockRejectedValueOnce(new Error('Update failed'));
    const store = useProductsStore();

    await expect(store.updateProduct(1, {})).rejects.toThrow('Update failed');
  });

  it('isLoading is set to true while fetching', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => { resolvePromise = resolve; });
    vi.mocked(ProductsAPI.findProductsAdmin).mockReturnValueOnce(promise as any);

    const store = useProductsStore();
    const fetchPromise = store.getProducts('');

    expect(store.isLoading).toBe(true);
    resolvePromise!({ data: mockProductResponse });
    await fetchPromise;
    expect(store.isLoading).toBe(false);
  });
});
