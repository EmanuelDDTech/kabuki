import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSaleStore } from '@/modules/cart/stores/sale';
import { State } from '@/modules/cart/interfaces/sale.interface';

vi.mock('@/modules/cart/api/SaleAPI', () => ({
  default: {
    getAll: vi.fn(),
    getAllAdmin: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    getByYear: vi.fn(),
    getByMonth: vi.fn(),
    getByWeek: vi.fn(),
    getByDay: vi.fn(),
  },
}));

import SaleAPI from '@/modules/cart/api/SaleAPI';

const mockSale = {
  id: 1,
  state: State.PENDING,
  require_payment: false,
  payment_method: 'paypal',
  amount_total: 500,
  amount_subtotal: 450,
  is_payed: true,
  invoice_required: false,
  user_id: 1,
  sale_carts: [
    {
      id: 1,
      quantity: 2,
      price_unit: 225,
      subtotal: 450,
      product: { id: 10, name: 'Card A', price: 225, active: true, discount: 0, stock_visible: true, product_galleries: [] },
    },
  ],
  discount_amount: 0,
  discount_code_id: 0,
  amount_shipping: 50,
  delivery_carrier_id: 1,
};

describe('useSaleStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty state', () => {
    const store = useSaleStore();
    expect(store.myPurchases).toEqual([]);
    expect(store.purchaseInfo).toBeNull();
    expect(store.isLoading).toBe(false);
  });

  it('getPurchases fetches and stores purchases', async () => {
    vi.mocked(SaleAPI.getAll).mockResolvedValueOnce({ data: [mockSale] } as any);
    const store = useSaleStore();

    await store.getPurchases();

    expect(store.myPurchases).toEqual([mockSale]);
    expect(store.isLoading).toBe(false);
  });

  it('getPurchases sets loading to false even on error', async () => {
    vi.mocked(SaleAPI.getAll).mockRejectedValueOnce(new Error('Network error'));
    const store = useSaleStore();

    await store.getPurchases();

    expect(store.isLoading).toBe(false);
  });

  it('getPurchasesAdmin fetches and stores purchases', async () => {
    vi.mocked(SaleAPI.getAllAdmin).mockResolvedValueOnce({ data: [mockSale] } as any);
    const store = useSaleStore();

    await store.getPurchasesAdmin({ state: 'pendiente' });

    expect(SaleAPI.getAllAdmin).toHaveBeenCalledWith({ state: 'pendiente' });
    expect(store.myPurchases).toEqual([mockSale]);
    expect(store.isLoading).toBe(false);
  });

  it('getPurchasesAdmin handles errors gracefully', async () => {
    vi.mocked(SaleAPI.getAllAdmin).mockRejectedValueOnce(new Error('Error'));
    const store = useSaleStore();

    await store.getPurchasesAdmin();

    expect(store.isLoading).toBe(false);
  });

  it('getLatestPurchases fetches and stores latest purchases', async () => {
    vi.mocked(SaleAPI.getAllAdmin).mockResolvedValueOnce({ data: [mockSale] } as any);
    const store = useSaleStore();

    await store.getLatestPurchases({ limit: '5' });

    expect(store.isLoading).toBe(false);
  });

  it('getPurchaseById fetches and stores purchase by id', async () => {
    vi.mocked(SaleAPI.getById).mockResolvedValueOnce({ data: mockSale } as any);
    const store = useSaleStore();

    await store.getPurchaseById(1);

    expect(store.purchaseInfo).toEqual(mockSale);
  });

  it('getMyPurchases returns the current myPurchases', async () => {
    vi.mocked(SaleAPI.getAll).mockResolvedValueOnce({ data: [mockSale] } as any);
    const store = useSaleStore();
    await store.getPurchases();

    expect(store.getMyPurchases()).toEqual([mockSale]);
  });

  it('getPurchaseInfo returns purchaseInfo', async () => {
    vi.mocked(SaleAPI.getById).mockResolvedValueOnce({ data: mockSale } as any);
    const store = useSaleStore();
    await store.getPurchaseById(1);

    expect(store.getPurchaseInfo()).toEqual(mockSale);
  });

  it('updateState updates the sale state', async () => {
    vi.mocked(SaleAPI.getById).mockResolvedValueOnce({ data: mockSale } as any);
    vi.mocked(SaleAPI.update).mockResolvedValueOnce({} as any);
    const store = useSaleStore();
    await store.getPurchaseById(1);

    await store.updateState(State.COMPLETED);

    expect(store.purchaseInfo?.state).toBe(State.COMPLETED);
    expect(SaleAPI.update).toHaveBeenCalledWith(1, expect.objectContaining({ state: State.COMPLETED }));
  });

  it('updateState throws error on API failure', async () => {
    vi.mocked(SaleAPI.getById).mockResolvedValueOnce({ data: mockSale } as any);
    vi.mocked(SaleAPI.update).mockRejectedValueOnce(new Error('Update failed'));
    const store = useSaleStore();
    await store.getPurchaseById(1);

    await expect(store.updateState(State.CANCELED)).rejects.toThrow('Update failed');
  });

  it('namesCombined returns combined product names for a sale', () => {
    const store = useSaleStore();
    const combined = store.namesCombined(mockSale as any);
    expect(combined.value).toBe('Card A');
  });

  it('namesCombined concatenates multiple product names', () => {
    const store = useSaleStore();
    const saleWithTwoProducts = {
      ...mockSale,
      sale_carts: [
        { ...mockSale.sale_carts[0] },
        { ...mockSale.sale_carts[0], product: { ...mockSale.sale_carts[0].product, name: 'Card B' } },
      ],
    };
    const combined = store.namesCombined(saleWithTwoProducts as any);
    expect(combined.value).toBe('Card A / Card B');
  });
});
