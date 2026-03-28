import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';

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
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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

import { useCouponStore } from '@/modules/cart/stores/coupons';

describe('useCouponStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const store = useCouponStore();
    expect(store.couponInput).toBe('');
    expect(store.couponValidationMessage).toBe('');
    expect(store.discount).toBe(0);
    expect(store.isValidCoupon).toBe(false);
  });

  it('$reset resets all state to defaults', () => {
    const store = useCouponStore();
    store.couponInput = 'PROMO10';
    store.couponValidationMessage = 'Aplicando...';

    store.$reset();

    expect(store.couponInput).toBe('');
    expect(store.couponValidationMessage).toBe('');
    expect(store.discount).toBe(0);
    expect(store.isValidCoupon).toBe(false);
  });

  it('isValidCoupon returns false when discountPercentage is 0', () => {
    const store = useCouponStore();
    expect(store.isValidCoupon).toBe(false);
  });

  it('applyCoupon sets error message for invalid coupon', () => {
    const store = useCouponStore();
    store.couponInput = 'INVALIDCODE';

    store.applyCoupon();

    expect(store.couponValidationMessage).toBe('No existe el cupón ingresado.');
  });

  it('applyCoupon with empty input sets error message', () => {
    const store = useCouponStore();
    store.couponInput = '';

    store.applyCoupon();

    expect(store.couponValidationMessage).toBe('No existe el cupón ingresado.');
  });
});
