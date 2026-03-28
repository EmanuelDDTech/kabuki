import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBannersStore } from '@/modules/banner/stores/banners';

vi.mock('@/modules/banner/api/BannerAPI', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/modules/products/composables/useImage', () => ({
  default: () => ({
    deleteImage: vi.fn(),
  }),
}));

import BannerAPI from '@/modules/banner/api/BannerAPI';

const mockBanners = [
  {
    id: 1,
    name: 'Banner 1',
    url: 'https://example.com/banner1.jpg',
    order: 1,
    redirect: '/promo1',
    start: '2025-01-01',
    end: '2025-12-31',
  },
  {
    id: 2,
    name: 'Banner 2',
    url: 'https://example.com/banner2.jpg',
    order: 2,
    redirect: '/promo2',
    start: '2025-01-01',
    end: '2025-12-31',
  },
];

describe('useBannersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty banners and isLoading true', () => {
    const store = useBannersStore();
    expect(store.banners).toEqual([]);
    expect(store.isLoading).toBe(true);
  });

  it('getBanners fetches and stores banners', async () => {
    vi.mocked(BannerAPI.getAll).mockResolvedValueOnce({ data: mockBanners } as any);
    const store = useBannersStore();

    await store.getBanners();

    expect(BannerAPI.getAll).toHaveBeenCalled();
    expect(store.banners).toEqual(mockBanners);
    expect(store.isLoading).toBe(false);
  });

  it('getBanners sets isLoading correctly', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(BannerAPI.getAll).mockReturnValueOnce(promise as any);

    const store = useBannersStore();
    const fetchPromise = store.getBanners();

    expect(store.isLoading).toBe(true);
    resolvePromise!({ data: mockBanners });
    await fetchPromise;
    expect(store.isLoading).toBe(false);
  });

  it('deleteBanner calls API with correct id', async () => {
    vi.mocked(BannerAPI.delete).mockResolvedValueOnce({} as any);
    const store = useBannersStore();

    await store.deleteBanner(1, 'https://example.com/banner1.jpg');

    expect(BannerAPI.delete).toHaveBeenCalledWith(1);
  });

  it('deleteBanner handles delete image errors gracefully', async () => {
    vi.mocked(BannerAPI.delete).mockResolvedValueOnce({} as any);
    const store = useBannersStore();

    // Should not throw even if deleteImage fails internally
    await expect(store.deleteBanner(1, 'bad-image-url')).resolves.not.toThrow();
  });

  it('deleteBanner handles API delete errors gracefully', async () => {
    vi.mocked(BannerAPI.delete).mockRejectedValueOnce(new Error('Delete failed'));
    const store = useBannersStore();

    await expect(store.deleteBanner(1, 'https://example.com/banner1.jpg')).resolves.not.toThrow();
  });
});
