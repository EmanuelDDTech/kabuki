import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router');

  return {
    ...actual,
    createWebHistory: vi.fn(() => ({
      location: '/',
      state: {},
      base: '/',
      createHref: (to: string) => to,
      replace: vi.fn(),
      push: vi.fn(),
      listen: vi.fn(),
      destroy: vi.fn(),
      go: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    })),
  };
});

import router from '@/router';

describe('router lastPath global guard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('guarda lastPath cuando la ruta no es auth', async () => {
    await router.push('/productos');

    expect(localStorage.getItem('lastPath')).toBe('/productos');
  });

  it('no guarda lastPath para rutas de auth', async () => {
    localStorage.setItem('lastPath', '/productos');

    await router.push('/auth/login');

    expect(localStorage.getItem('lastPath')).toBe('/productos');
  });
});
