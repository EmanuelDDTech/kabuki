import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({
  userStore: {
    checkAuthStatus: vi.fn(),
    isAdmin: false,
  },
}));

vi.mock('@/modules/auth/stores/user', () => ({
  useUserStore: () => mocked.userStore,
}));

import isAdminGuard from '@/modules/auth/guards/is-admin.guard';

describe('isAdminGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocked.userStore.isAdmin = false;
    mocked.userStore.checkAuthStatus.mockResolvedValue(true);
  });

  it('permite navegación cuando el usuario es admin', async () => {
    const next = vi.fn();
    mocked.userStore.isAdmin = true;

    await isAdminGuard({} as any, {} as any, next);

    expect(mocked.userStore.checkAuthStatus).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });

  it('redirige a home cuando el usuario no es admin', async () => {
    const next = vi.fn();

    await isAdminGuard({} as any, {} as any, next);

    expect(mocked.userStore.checkAuthStatus).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith({ name: 'home' });
  });
});
