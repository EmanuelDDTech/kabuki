import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUserStore } from '@/modules/auth/stores/user';
import { AuthStatus } from '@/modules/auth/interfaces/auth-status.enum';

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ path: '/', params: {} }),
}));

vi.mock('@/modules/auth/api/AuthAPI', () => ({
  default: {
    auth: vi.fn(),
  },
}));

import AuthAPI from '@/modules/auth/api/AuthAPI';

const mockUser = {
  id: 1,
  email: 'test@example.com',
  isAdmin: false,
  name: 'Test User',
  verified: true,
  carts: [],
};

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('initializes with checking status and no user', () => {
    const store = useUserStore();
    expect(store.authStatus).toBe(AuthStatus.Checking);
    expect(store.user).toBeUndefined();
  });

  it('isChecking returns true when status is Checking', () => {
    const store = useUserStore();
    expect(store.isChecking).toBe(true);
  });

  it('isAuthenticated returns false initially', () => {
    const store = useUserStore();
    expect(store.isAuthenticated).toBe(false);
  });

  it('isUnauthenticated returns false initially', () => {
    const store = useUserStore();
    expect(store.isUnauthenticated).toBe(false);
  });

  it('isSet returns false when user is null/undefined', () => {
    const store = useUserStore();
    expect(store.isSet).toBe(false);
  });

  it('getUserName returns empty string when no user', () => {
    const store = useUserStore();
    expect(store.getUserName).toBe('');
  });

  it('logout clears user, sets unauthenticated status, and removes token', () => {
    localStorage.setItem('AUTH_TOKEN', 'token123');
    const store = useUserStore();
    store.user = mockUser;
    store.authStatus = AuthStatus.Authenticated;

    const result = store.logout();

    expect(result).toBe(false);
    expect(store.user).toBeNull();
    expect(store.authStatus).toBe(AuthStatus.Unauthenticated);
    expect(localStorage.getItem('AUTH_TOKEN')).toBeNull();
  });

  it('checkAuthStatus returns true and sets user on success', async () => {
    vi.mocked(AuthAPI.auth).mockResolvedValueOnce({ data: mockUser } as any);
    const store = useUserStore();

    const result = await store.checkAuthStatus();

    expect(result).toBe(true);
    expect(store.authStatus).toBe(AuthStatus.Authenticated);
    expect(store.user).toEqual(mockUser);
  });

  it('checkAuthStatus returns false and calls logout when no data', async () => {
    vi.mocked(AuthAPI.auth).mockResolvedValueOnce({ data: null } as any);
    const store = useUserStore();

    const result = await store.checkAuthStatus();

    expect(result).toBe(false);
    expect(store.authStatus).toBe(AuthStatus.Unauthenticated);
  });

  it('checkAuthStatus returns false and calls logout on error', async () => {
    vi.mocked(AuthAPI.auth).mockRejectedValueOnce(new Error('Network error'));
    const store = useUserStore();

    const result = await store.checkAuthStatus();

    expect(result).toBe(false);
    expect(store.authStatus).toBe(AuthStatus.Unauthenticated);
  });

  it('setUser calls AuthAPI.auth and sets user', async () => {
    vi.mocked(AuthAPI.auth).mockResolvedValueOnce({ data: mockUser } as any);
    const store = useUserStore();

    await store.setUser();

    expect(store.user).toEqual(mockUser);
  });

  it('isSet returns true when user is set', async () => {
    vi.mocked(AuthAPI.auth).mockResolvedValueOnce({ data: mockUser } as any);
    const store = useUserStore();
    await store.checkAuthStatus();

    expect(store.isSet).toBe(true);
  });

  it('getUserName returns user name when user is set', async () => {
    vi.mocked(AuthAPI.auth).mockResolvedValueOnce({ data: mockUser } as any);
    const store = useUserStore();
    await store.checkAuthStatus();

    expect(store.getUserName).toBe('Test User');
  });

  it('isAdmin returns false for non-admin user', async () => {
    vi.mocked(AuthAPI.auth).mockResolvedValueOnce({ data: mockUser } as any);
    const store = useUserStore();
    await store.checkAuthStatus();

    expect(store.isAdmin).toBe(false);
  });
});
