import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({
  userStore: {
    checkAuthStatus: vi.fn(),
    isUnauthenticated: false,
  },
}));

vi.mock('@/modules/auth/stores/user', () => ({
  useUserStore: () => mocked.userStore,
}));

import isAuthenticatedGuard from '@/modules/auth/guards/is-authenticated.guard';

describe('isAuthenticatedGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocked.userStore.isUnauthenticated = false;
    mocked.userStore.checkAuthStatus.mockResolvedValue(true);
  });

  it('permite navegación cuando el usuario está autenticado', async () => {
    const next = vi.fn();

    await isAuthenticatedGuard({} as any, {} as any, next);

    expect(mocked.userStore.checkAuthStatus).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });

  it('redirige a home cuando el usuario no está autenticado', async () => {
    const next = vi.fn();
    mocked.userStore.isUnauthenticated = true;

    await isAuthenticatedGuard({} as any, {} as any, next);

    expect(mocked.userStore.checkAuthStatus).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith({ name: 'home' });
  });
});
