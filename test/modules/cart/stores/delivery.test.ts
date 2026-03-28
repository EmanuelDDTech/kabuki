import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDeliveryStore } from '@/modules/cart/stores/delivery';
import type { Delivery } from '@/modules/cart/interfaces/delivery.interface';

vi.mock('@/modules/cart/api/DeliveryAPI', () => ({
  default: {
    findAvailable: vi.fn(),
  },
}));

import DeliveryAPI from '@/modules/cart/api/DeliveryAPI';

const mockDelivery: Delivery = {
  id: 1,
  name: 'DHL',
  active: true,
  fized_price: 100,
  servicelevel: 'standard',
  free_over: false,
  image: 'dhl.png',
  delivery_price_rules: [{ id: 1, carrier_id: 1, max_value: 10, list_base_price: 99 }],
};

const mockFreeDelivery: Delivery = {
  ...mockDelivery,
  id: 2,
  name: 'Express',
  free_over: true,
};

describe('useDeliveryStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const store = useDeliveryStore();
    expect(store.carriers).toEqual([]);
    expect(store.deliveriesAvailable).toEqual([]);
    expect(store.amountShipping).toBe(0);
    expect(store.carrierSelected).toBeNull();
    expect(store.isCarrierSelected).toBe(false);
  });

  it('setAmountShipping sets the amount', () => {
    const store = useDeliveryStore();
    store.setAmountShipping(150);
    expect(store.amountShipping).toBe(150);
  });

  it('setCarrierSelected sets the carrier', () => {
    const store = useDeliveryStore();
    store.setCarrierSelected(mockDelivery);
    expect(store.carrierSelected).toEqual(mockDelivery);
    expect(store.isCarrierSelected).toBe(true);
  });

  it('clearSelectedAddress resets amount and carrier', () => {
    const store = useDeliveryStore();
    store.setCarrierSelected(mockDelivery);
    store.setAmountShipping(99);

    store.clearSelectedAddress();

    expect(store.amountShipping).toBe(0);
    expect(store.carrierSelected).toBeNull();
  });

  it('findDeliveriesAvailable does nothing when cartWeight <= 0', async () => {
    const store = useDeliveryStore();
    await store.findDeliveriesAvailable(12345, 0);
    expect(DeliveryAPI.findAvailable).not.toHaveBeenCalled();
  });

  it('findDeliveriesAvailable fetches deliveries and updates state', async () => {
    vi.mocked(DeliveryAPI.findAvailable).mockResolvedValueOnce({
      data: [mockDelivery],
    } as any);
    const store = useDeliveryStore();

    await store.findDeliveriesAvailable(12345, 500);

    expect(DeliveryAPI.findAvailable).toHaveBeenCalledWith(500, 12345);
    expect(store.deliveriesAvailable).toEqual([mockDelivery]);
  });

  it('findDeliveriesAvailable handles API errors gracefully', async () => {
    vi.mocked(DeliveryAPI.findAvailable).mockRejectedValueOnce(new Error('Network error'));
    const store = useDeliveryStore();

    await store.findDeliveriesAvailable(12345, 500);

    expect(store.deliveriesAvailable).toEqual([]);
  });

  it('isCarrierSelected returns true when carrier is set', () => {
    const store = useDeliveryStore();
    store.setCarrierSelected(mockDelivery);
    expect(store.isCarrierSelected).toBe(true);
  });

  it('isCarrierSelected returns false after clearing', () => {
    const store = useDeliveryStore();
    store.setCarrierSelected(mockDelivery);
    store.clearSelectedAddress();
    expect(store.isCarrierSelected).toBe(false);
  });
});
