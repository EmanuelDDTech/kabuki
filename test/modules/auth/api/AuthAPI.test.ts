import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
}));

vi.mock('@/lib/axios', () => ({
  default: {
    post: mocked.post,
    get: mocked.get,
  },
}));

import AuthAPI from '@/modules/auth/api/AuthAPI';

describe('AuthAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('register usa endpoint esperado', async () => {
    const payload = { name: 'Ana', email: 'ana@test.com', password: '123456' } as any;
    mocked.post.mockResolvedValueOnce({ data: { ok: true } });

    await AuthAPI.register(payload);

    expect(mocked.post).toHaveBeenCalledWith('/auth/registrar', payload);
  });

  it('verifyAccount usa endpoint con token', async () => {
    mocked.get.mockResolvedValueOnce({ data: { ok: true } });

    await AuthAPI.verifyAccount('token-123');

    expect(mocked.get).toHaveBeenCalledWith('/auth/verificar/token-123');
  });

  it('login usa endpoint esperado', async () => {
    const payload = { email: 'ana@test.com', password: '123456' } as any;
    mocked.post.mockResolvedValueOnce({ data: { token: 'abc' } });

    await AuthAPI.login(payload);

    expect(mocked.post).toHaveBeenCalledWith('/auth/login', payload);
  });

  it('googleLogin usa endpoint esperado', async () => {
    const payload = { credential: 'google-token' };
    mocked.post.mockResolvedValueOnce({ data: { token: 'abc' } });

    await AuthAPI.googleLogin(payload);

    expect(mocked.post).toHaveBeenCalledWith('/auth/google', payload);
  });

  it('auth envía Authorization con token en localStorage', async () => {
    localStorage.setItem('AUTH_TOKEN', 'token-abc');
    mocked.get.mockResolvedValueOnce({ data: { id: 1 } });

    await AuthAPI.auth();

    expect(mocked.get).toHaveBeenCalledWith('/auth/user', {
      headers: { Authorization: 'Bearer token-abc' },
    });
  });

  it('isAdmin envía Authorization con token en localStorage', async () => {
    localStorage.setItem('AUTH_TOKEN', 'token-admin');
    mocked.get.mockResolvedValueOnce({ data: { isAdmin: true } });

    await AuthAPI.isAdmin();

    expect(mocked.get).toHaveBeenCalledWith('/auth/admin', {
      headers: { Authorization: 'Bearer token-admin' },
    });
  });
});
