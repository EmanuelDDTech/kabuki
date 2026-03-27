import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({
  createPreferenceActionMock: vi.fn(),
  processPaymentActionMock: vi.fn(),
  cartStoreMock: {
    items: [
      {
        product: { id: 1, name: 'Test Product', price: 120 },
        quantity: 2,
      },
    ],
    getSaleData: vi.fn(() => ({ sale: 'metadata' })),
    clearDiscount: vi.fn(),
    deleteCart: vi.fn(async () => {}),
  },
  deliveryStoreMock: {
    amountShipping: 99,
    clearSelectedAddress: vi.fn(),
  },
  addressStoreMock: {
    clearSelectedAddress: vi.fn(),
  },
}));

vi.mock('@/modules/payments/actions', () => ({
  createPreferenceAction: mocked.createPreferenceActionMock,
}));

vi.mock('@/modules/payments/actions/process-payment.mercadopago.action', () => ({
  processPaymentAction: mocked.processPaymentActionMock,
}));

vi.mock('@/modules/cart/stores/cart', () => ({
  useCartStore: () => mocked.cartStoreMock,
}));

vi.mock('@/modules/cart/stores/delivery', () => ({
  useDeliveryStore: () => mocked.deliveryStoreMock,
}));

vi.mock('@/modules/cart/stores/address', () => ({
  useAddressStore: () => mocked.addressStoreMock,
}));

vi.mock('@/modules/auth/stores/user', () => ({
  useUserStore: () => ({ user: null }),
}));

vi.mock('@/modules/discountCode/stores/discountCode', () => ({
  useDiscountCodeStore: () => ({
    selectedDiscountCode: null,
    isDiscountCodeSelected: false,
  }),
}));

import { useMercadopagoStore } from '@/modules/cart/stores/mercadopago';

describe('useMercadopagoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('createPreference guarda preferenceId cuando la acción responde ok', async () => {
    mocked.createPreferenceActionMock.mockResolvedValueOnce({ ok: true, data: 'pref_123' });
    const store = useMercadopagoStore();

    await store.createPreference();

    expect(mocked.createPreferenceActionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        items: [{ id: '1', title: 'Test Product', quantity: 2, unit_price: 120 }],
        shipments: { cost: 99, mode: 'not_specified' },
        metadata: { sale: 'metadata' },
      }),
    );
    expect(store.preferenceId).toBe('pref_123');
  });

  it('createPreference limpia preferenceId cuando la acción responde ok=false', async () => {
    mocked.createPreferenceActionMock.mockResolvedValueOnce({ ok: false });
    const store = useMercadopagoStore();

    await store.createPreference();

    expect(store.preferenceId).toBeUndefined();
  });

  it('processPayment ejecuta limpieza de carrito y dirección cuando procesa', async () => {
    mocked.processPaymentActionMock.mockResolvedValueOnce(true);
    const store = useMercadopagoStore();

    const result = await store.processPayment('pay_001');

    expect(mocked.processPaymentActionMock).toHaveBeenCalledWith('pay_001');
    expect(mocked.cartStoreMock.clearDiscount).toHaveBeenCalled();
    expect(mocked.cartStoreMock.deleteCart).toHaveBeenCalled();
    expect(mocked.addressStoreMock.clearSelectedAddress).toHaveBeenCalled();
    expect(mocked.deliveryStoreMock.clearSelectedAddress).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
