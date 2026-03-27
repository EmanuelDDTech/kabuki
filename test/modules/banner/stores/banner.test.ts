import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('vuefire', () => ({
  useFirebaseStorage: vi.fn().mockReturnValue({}),
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytesResumable: vi.fn(),
  getDownloadURL: vi.fn(),
}));

vi.mock('uid', () => ({
  uid: vi.fn().mockReturnValue('mock-uid'),
}));

vi.mock('@/modules/products/composables/useImage', () => ({
  default: vi.fn().mockReturnValue({
    deleteImage: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock('@/modules/banner/api/BannerAPI', () => ({
  default: {
    create: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    getAll: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/helpers/date', () => ({
  convertToISO: vi.fn((d) => `${d}T00:00:00.000Z`),
  convertToYYYYMMDD: vi.fn((d) => d.split('T')[0]),
}));

import BannerAPI from '@/modules/banner/api/BannerAPI';
import { useBannerStore } from '@/modules/banner/stores/banner';

const mockBanner = {
  id: 1,
  name: 'Summer Sale',
  url: 'https://example.com/banner.jpg',
  order: 1,
  redirect: '/summer',
  start: '2025-06-01T00:00:00.000Z',
  end: '2025-06-30T00:00:00.000Z',
};

describe('useBannerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty state', () => {
    const store = useBannerStore();
    expect(store.id).toBe(0);
    expect(store.name).toBe('');
    expect(store.url).toBe('');
    expect(store.order).toBe(0);
    expect(store.redirect).toBe('');
    expect(store.start).toBe('');
    expect(store.end).toBe('');
    expect(store.newUrl).toBe('');
  });

  it('isImageUploaded returns null when newUrl is empty', () => {
    const store = useBannerStore();
    expect(store.isImageUploaded).toBeNull();
  });

  it('isImageUploaded returns url when newUrl is set', () => {
    const store = useBannerStore();
    store.newUrl = 'https://example.com/new.jpg';
    expect(store.isImageUploaded).toBe('https://example.com/new.jpg');
  });

  it('cleanBanner resets all fields to deraults', () => {
    const store = useBannerStore();
    store.name = 'Test';
    store.url = 'https://example.com/test.jpg';
    store.order = 5;
    store.redirect = '/test';
    store.startISO = '2025-01-01';
    store.endISO = '2025-12-31';

    store.cleanBanner();

    expect(store.id).toBe(0);
    expect(store.name).toBe('');
    expect(store.url).toBe('');
    expect(store.order).toBe(0);
    expect(store.redirect).toBe('');
    expect(store.start).toBe('');
    expect(store.end).toBe('');
    expect(store.startISO).toBe('');
    expect(store.endISO).toBe('');
  });

  it('findBanner fetches banner by id and populates state', async () => {
    vi.mocked(BannerAPI.getById).mockResolvedValueOnce({ data: mockBanner } as any);
    const store = useBannerStore();

    await store.findBanner(1);

    expect(BannerAPI.getById).toHaveBeenCalledWith(1);
    expect(store.id).toBe(1);
    expect(store.name).toBe('Summer Sale');
    expect(store.url).toBe('https://example.com/banner.jpg');
    expect(store.order).toBe(1);
    expect(store.redirect).toBe('/summer');
  });

  it('findBanner handles errors gracefully', async () => {
    vi.mocked(BannerAPI.getById).mockRejectedValueOnce(new Error('Not found'));
    const store = useBannerStore();

    await store.findBanner(999);

    expect(store.name).toBe('');
  });

  it('setStartDate converts and sets start date', () => {
    const store = useBannerStore();
    store.setStartDate('2025-06-01');
    expect(store.start).toBe('2025-06-01T00:00:00.000Z');
  });

  it('setEndDate converts and sets end date', () => {
    const store = useBannerStore();
    store.setEndDate('2025-06-30');
    expect(store.end).toBe('2025-06-30T00:00:00.000Z');
  });

  it('create calls BannerAPI and stores id', async () => {
    vi.mocked(BannerAPI.create).mockResolvedValueOnce({ data: { ...mockBanner, id: 10 } } as any);
    const store = useBannerStore();
    store.name = 'Summer Sale';
    store.order = 1;
    store.redirect = '/summer';
    store.startISO = '2025-06-01';
    store.endISO = '2025-06-30';

    const result = await store.create();

    expect(BannerAPI.create).toHaveBeenCalled();
    expect(store.id).toBe(10);
    expect(result).toEqual({ ...mockBanner, id: 10 });
  });

  it('create handles errors gracefully', async () => {
    vi.mocked(BannerAPI.create).mockRejectedValueOnce(new Error('Create failed'));
    const store = useBannerStore();

    const result = await store.create();

    expect(result).toBeUndefined();
  });

  it('update calls BannerAPI with banner data', async () => {
    vi.mocked(BannerAPI.update).mockResolvedValueOnce({ data: mockBanner } as any);
    const store = useBannerStore();
    store.id = 1;
    store.name = 'Updated Banner';
    store.order = 2;
    store.startISO = '2025-07-01';
    store.endISO = '2025-07-31';

    await store.update();

    expect(BannerAPI.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ name: 'Updated Banner' }),
    );
  });

  it('update handles errors gracefully', async () => {
    vi.mocked(BannerAPI.update).mockRejectedValueOnce(new Error('Update failed'));
    const store = useBannerStore();
    store.id = 1;

    const result = await store.update();

    expect(result).toBeUndefined();
  });
});
