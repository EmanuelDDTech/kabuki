import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiscountType } from '@/modules/discountCode/interfaces/discountCode.interface';

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ path: '/', params: {}, query: {} }),
}));

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    inject: vi.fn().mockReturnValue({ open: vi.fn() }),
  };
});

vi.mock('@/modules/discountCode/api/DiscountCodeAPI', () => ({
  default: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getByCode: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    updateTimesUsed: vi.fn(),
  },
}));

vi.mock('@/modules/campaign/api/CampaignAPI', () => ({
  default: {
    getAll: vi.fn(),
    getAllAdmin: vi.fn(),
  },
}));

vi.mock('@/modules/auth/api/AuthAPI', () => ({
  default: { auth: vi.fn() },
}));

vi.mock('@/modules/cart/api/CartAPI', () => ({
  default: {
    get: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/modules/cart/api/SaleAPI', () => ({
  default: {
    create: vi.fn(),
    getAll: vi.fn(),
    getAllAdmin: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('@/modules/product/api/ProductAPI', () => ({
  default: {
    findById: vi.fn(),
    search: vi.fn(),
  },
}));

vi.mock('@/modules/cart/api/AddressAPI', () => ({
  default: {
    create: vi.fn(),
    update: vi.fn(),
    getAll: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/modules/cart/api/DeliveryAPI', () => ({
  default: { findAvailable: vi.fn() },
}));

import DiscountCodeAPI from '@/modules/discountCode/api/DiscountCodeAPI';
import { useDiscountCodeStore } from '@/modules/discountCode/stores/discountCode';

const mockDiscountCode = {
  id: 1,
  code: 'SAVE10',
  discount_type: DiscountType.FIXED,
  discount_value: 50,
  min_purchase: 200,
  max_discount: 100,
  usage_limit: 10,
  times_used: 2,
  expires_at: '2025-12-31T23:59:59.000Z',
};

const mockPercentageCode = {
  ...mockDiscountCode,
  id: 2,
  code: 'PERCENT15',
  discount_type: DiscountType.PERCENTAGE,
  discount_value: 15,
};

describe('useDiscountCodeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty discount codes', () => {
    const store = useDiscountCodeStore();
    expect(store.discountCodes).toEqual([]);
    expect(store.selectedDiscountCode).toBeNull();
    expect(store.isDiscountCodeSelected).toBe(false);
  });

  it('discountCode initializes with default values', () => {
    const store = useDiscountCodeStore();
    expect(store.discountCode.id).toBe(0);
    expect(store.discountCode.code).toBe('');
    expect(store.discountCode.discount_type).toBe(DiscountType.FIXED);
    expect(store.discountCode.discount_value).toBe(0);
  });

  it('getDiscountCodesAll fetches and stores discount codes', async () => {
    vi.mocked(DiscountCodeAPI.getAll).mockResolvedValueOnce({ data: [mockDiscountCode] } as any);
    const store = useDiscountCodeStore();

    await store.getDiscountCodesAll();

    expect(store.discountCodes).toEqual([mockDiscountCode]);
  });

  it('getDiscountCodesAll handles errors gracefully', async () => {
    vi.mocked(DiscountCodeAPI.getAll).mockRejectedValueOnce(new Error('API error'));
    const store = useDiscountCodeStore();

    await store.getDiscountCodesAll();

    expect(store.discountCodes).toEqual([]);
  });

  it('cleanDiscountCode resets discountCode to initial values', async () => {
    vi.mocked(DiscountCodeAPI.getById).mockResolvedValueOnce({ data: mockDiscountCode } as any);
    const store = useDiscountCodeStore();
    await store.getDiscountCodeById(1);

    store.cleanDiscountCode();

    expect(store.discountCode.id).toBe(0);
    expect(store.discountCode.code).toBe('');
    expect(store.expires_at_ISO).toBe('');
  });

  it('getDiscountCodeById fetches and sets discount code', async () => {
    vi.mocked(DiscountCodeAPI.getById).mockResolvedValueOnce({ data: mockDiscountCode } as any);
    const store = useDiscountCodeStore();

    await store.getDiscountCodeById(1);

    expect(store.discountCode).toEqual(mockDiscountCode);
    expect(DiscountCodeAPI.getById).toHaveBeenCalledWith(1);
  });

  it('getDiscountCodeById throws on error', async () => {
    vi.mocked(DiscountCodeAPI.getById).mockRejectedValueOnce(new Error('Not found'));
    const store = useDiscountCodeStore();

    await expect(store.getDiscountCodeById(999)).rejects.toThrow('Not found');
  });

  it('deleteDiscountCode calls API and refreshes list', async () => {
    vi.mocked(DiscountCodeAPI.delete).mockResolvedValueOnce({} as any);
    vi.mocked(DiscountCodeAPI.getAll).mockResolvedValueOnce({ data: [] } as any);
    const store = useDiscountCodeStore();

    await store.deleteDiscountCode(1);

    expect(DiscountCodeAPI.delete).toHaveBeenCalledWith(1);
  });

  it('deleteDiscountCode throws on API error', async () => {
    vi.mocked(DiscountCodeAPI.delete).mockRejectedValueOnce(new Error('Delete failed'));
    const store = useDiscountCodeStore();

    await expect(store.deleteDiscountCode(1)).rejects.toThrow('Delete failed');
  });

  it('clearSelectedDiscountCode sets selectedDiscountCode to null', async () => {
    const store = useDiscountCodeStore();
    store.selectedDiscountCode = mockDiscountCode;

    store.clearSelectedDiscountCode();

    expect(store.selectedDiscountCode).toBeNull();
    expect(store.isDiscountCodeSelected).toBe(false);
  });

  it('isDiscountCodeSelected returns true when a code is selected', () => {
    const store = useDiscountCodeStore();
    store.selectedDiscountCode = mockDiscountCode;
    expect(store.isDiscountCodeSelected).toBe(true);
  });

  it('UpdateDiscountCode calls API to update', async () => {
    vi.mocked(DiscountCodeAPI.update).mockResolvedValueOnce({ data: mockDiscountCode } as any);
    const store = useDiscountCodeStore();
    store.discountCode = { ...mockDiscountCode };
    store.expires_at_ISO = '2025-12-31';

    await store.UpdateDiscountCode();

    expect(DiscountCodeAPI.update).toHaveBeenCalled();
  });

  it('UpdateDiscountCode throws on API error', async () => {
    vi.mocked(DiscountCodeAPI.update).mockRejectedValueOnce(new Error('Update failed'));
    const store = useDiscountCodeStore();
    store.discountCode = { ...mockDiscountCode };
    store.expires_at_ISO = '2025-12-31';

    await expect(store.UpdateDiscountCode()).rejects.toThrow('Update failed');
  });

  it('updateTimesUsed calls API to update times used', async () => {
    vi.mocked(DiscountCodeAPI.updateTimesUsed).mockResolvedValueOnce({} as any);
    const store = useDiscountCodeStore();
    store.selectedDiscountCode = mockDiscountCode;

    await store.updateTimesUsed();

    expect(DiscountCodeAPI.updateTimesUsed).toHaveBeenCalledWith(mockDiscountCode.code);
  });
});
