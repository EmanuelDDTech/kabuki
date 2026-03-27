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

vi.mock('@/modules/filter/store/filterCategory', () => ({
  useFilterCategoryStore: () => ({ filters: [] }),
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

import CartAPI from '@/modules/cart/api/CartAPI';
import ProductAPI from '@/modules/product/api/ProductAPI';
import { useCartStore } from '@/modules/cart/stores/cart';
import { useUserStore } from '@/modules/auth/stores/user';
import { AuthStatus } from '@/modules/auth/interfaces/auth-status.enum';

const mockProduct = {
  id: 1,
  name: 'Card A',
  price: 100,
  active: true,
  discount: 0,
  stock: 5,
  stock_visible: true,
  weight: 0.1,
  product_galleries: [],
};

const mockCartItem = { id: 1, quantity: 2, product: mockProduct };

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('initializes with empty items and zeros', () => {
    const store = useCartStore();
    expect(store.items).toEqual([]);
    expect(store.subtotal).toBe(0);
    expect(store.total).toBe(0);
    expect(store.isEmpty).toBe(true);
    expect(store.payNow).toBe(false);
  });

  it('isEmpty returns false when items exist', async () => {
    vi.mocked(CartAPI.get).mockResolvedValueOnce({ data: [mockCartItem] } as any);
    const userStore = useUserStore();
    userStore.user = {
      id: 1,
      email: 'a@a.com',
      isAdmin: false,
      name: 'A',
      verified: true,
      carts: [],
    };
    userStore.authStatus = AuthStatus.Authenticated;

    const store = useCartStore();
    await store.getCart();

    expect(store.isEmpty).toBe(false);
  });

  it('getCart fetches from API when user is set', async () => {
    vi.mocked(CartAPI.get).mockResolvedValueOnce({ data: [mockCartItem] } as any);
    const userStore = useUserStore();
    userStore.user = {
      id: 1,
      email: 'a@a.com',
      isAdmin: false,
      name: 'A',
      verified: true,
      carts: [],
    };
    userStore.authStatus = AuthStatus.Authenticated;

    const store = useCartStore();
    await store.getCart();

    expect(CartAPI.get).toHaveBeenCalled();
    expect(store.items).toEqual([mockCartItem]);
  });

  it('getCart reads from localStorage when user is not set', async () => {
    vi.mocked(ProductAPI.findById).mockResolvedValueOnce({ data: mockProduct } as any);
    localStorage.setItem('_shorikame_cart', JSON.stringify([{ id: 1, quantity: 3 }]));

    const store = useCartStore();
    await store.getCart();

    await new Promise((r) => setTimeout(r, 10));
    expect(ProductAPI.findById).toHaveBeenCalledWith(1);
  });

  it('addItem adds product to localStorage for guest user', async () => {
    vi.mocked(ProductAPI.findById).mockResolvedValueOnce({ data: mockProduct } as any);
    const store = useCartStore();

    await store.addItem(mockProduct as any);

    const localCart = JSON.parse(localStorage.getItem('_shorikame_cart')!);
    expect(localCart).toContainEqual({ id: 1, quantity: 1 });
  });

  it('addItem calls CartAPI for authenticated user', async () => {
    vi.mocked(CartAPI.add).mockResolvedValueOnce({} as any);
    vi.mocked(CartAPI.get).mockResolvedValueOnce({ data: [mockCartItem] } as any);
    const userStore = useUserStore();
    userStore.user = {
      id: 1,
      email: 'a@a.com',
      isAdmin: false,
      name: 'A',
      verified: true,
      carts: [],
    };
    userStore.authStatus = AuthStatus.Authenticated;

    const store = useCartStore();
    await store.addItem(mockProduct as any);

    expect(CartAPI.add).toHaveBeenCalledWith({ productId: mockProduct.id });
  });

  it('removeItem removes product from items list', async () => {
    vi.mocked(CartAPI.get).mockResolvedValueOnce({ data: [mockCartItem] } as any);
    vi.mocked(CartAPI.delete).mockResolvedValueOnce({} as any);
    const userStore = useUserStore();
    userStore.user = {
      id: 1,
      email: 'a@a.com',
      isAdmin: false,
      name: 'A',
      verified: true,
      carts: [],
    };
    userStore.authStatus = AuthStatus.Authenticated;

    const store = useCartStore();
    await store.getCart();
    await store.removeItem(mockProduct.id);

    expect(store.items).toHaveLength(0);
  });

  it('checkout sets payNow to true', async () => {
    const store = useCartStore();
    await store.checkout();
    expect(store.payNow).toBe(true);
  });

  it('subtotal is computed based on items', async () => {
    vi.mocked(CartAPI.get).mockResolvedValueOnce({ data: [mockCartItem] } as any);
    const userStore = useUserStore();
    userStore.user = {
      id: 1,
      email: 'a@a.com',
      isAdmin: false,
      name: 'A',
      verified: true,
      carts: [],
    };
    userStore.authStatus = AuthStatus.Authenticated;

    const store = useCartStore();
    await store.getCart();
    await new Promise((r) => setTimeout(r, 0));

    expect(store.subtotal).toBe(200); // 100 * 2
  });

  it('getSaleProductsData returns product data from items', async () => {
    vi.mocked(CartAPI.get).mockResolvedValueOnce({ data: [mockCartItem] } as any);
    const userStore = useUserStore();
    userStore.user = {
      id: 1,
      email: 'a@a.com',
      isAdmin: false,
      name: 'A',
      verified: true,
      carts: [],
    };
    userStore.authStatus = AuthStatus.Authenticated;

    const store = useCartStore();
    await store.getCart();

    const productsData = store.getSaleProductsData();
    expect(productsData).toEqual([
      {
        product_id: mockProduct.id,
        quantity: mockCartItem.quantity,
        price_unit: mockProduct.price,
        subtotal: mockCartItem.quantity * mockProduct.price,
      },
    ]);
  });

  it('reduceQuantity decreases quantity for guest user', async () => {
    localStorage.setItem('_shorikame_cart', JSON.stringify([{ id: 1, quantity: 3 }]));
    const store = useCartStore();
    store.items = [{ id: 0, quantity: 3, product: mockProduct }];

    await store.reduceQuantity(mockProduct.id, 3);

    expect(store.items[0].quantity).toBe(2);
  });

  it('increaseQuantity increases quantity for guest user', async () => {
    localStorage.setItem('_shorikame_cart', JSON.stringify([{ id: 1, quantity: 2 }]));
    const store = useCartStore();
    store.items = [{ id: 0, quantity: 2, product: mockProduct }];

    await store.increaseQuantity(mockProduct.id, 2);

    expect(store.items[0].quantity).toBe(3);
  });
});
