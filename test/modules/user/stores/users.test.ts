import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUsersStore } from '@/modules/user/stores/users';

vi.mock('@/modules/user/api/userAPI', () => ({
  default: {
    getAll: vi.fn(),
    getById: vi.fn(),
  },
}));

import userAPI from '@/modules/user/api/userAPI';

const mockUser = {
  id: 1,
  email: 'user@example.com',
  isAdmin: false,
  name: 'John Doe',
  verified: true,
  carts: [],
};

const mockUserWithCart = {
  ...mockUser,
  carts: [{ id: 10 }],
};

describe('useUsersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty users and latestUsers', () => {
    const store = useUsersStore();
    expect(store.userList).toEqual([]);
    expect(store.latestUsersList).toEqual([]);
    expect(store.noUsers).toBe(true);
  });

  it('userData is undefined initially', () => {
    const store = useUsersStore();
    expect(store.userData).toBeUndefined();
  });

  it('getUsers fetches and stores users', async () => {
    vi.mocked(userAPI.getAll).mockResolvedValueOnce({ data: [mockUser] } as any);
    const store = useUsersStore();

    await store.getUsers();

    expect(store.userList).toEqual([mockUser]);
    expect(store.noUsers).toBe(false);
  });

  it('getUsers handles errors gracefully', async () => {
    vi.mocked(userAPI.getAll).mockRejectedValueOnce(new Error('Network error'));
    const store = useUsersStore();

    await store.getUsers();

    expect(store.userList).toEqual([]);
  });

  it('getLatestUsers fetches and stores latest users with query', async () => {
    vi.mocked(userAPI.getAll).mockResolvedValueOnce({ data: [mockUser] } as any);
    const store = useUsersStore();

    await store.getLatestUsers({ limit: '5' });

    expect(store.latestUsersList).toEqual([mockUser]);
  });

  it('getLatestUsers handles errors gracefully', async () => {
    vi.mocked(userAPI.getAll).mockRejectedValueOnce(new Error('Network error'));
    const store = useUsersStore();

    await store.getLatestUsers({});

    expect(store.latestUsersList).toEqual([]);
  });

  it('getUserById fetches and stores single user', async () => {
    vi.mocked(userAPI.getById).mockResolvedValueOnce({ data: mockUser } as any);
    const store = useUsersStore();

    await store.getUserById(1);

    expect(store.userData).toEqual(mockUser);
  });

  it('getUserById handles errors gracefully', async () => {
    vi.mocked(userAPI.getById).mockRejectedValueOnce(new Error('Not found'));
    const store = useUsersStore();

    await store.getUserById(999);

    expect(store.userData).toBeUndefined();
  });

  it('emptyCart returns true when user has no carts', async () => {
    vi.mocked(userAPI.getById).mockResolvedValueOnce({ data: mockUser } as any);
    const store = useUsersStore();
    await store.getUserById(1);

    expect(store.emptyCart).toBe(true);
  });

  it('emptyCart returns false when user has carts', async () => {
    vi.mocked(userAPI.getById).mockResolvedValueOnce({ data: mockUserWithCart } as any);
    const store = useUsersStore();
    await store.getUserById(1);

    expect(store.emptyCart).toBe(false);
  });

  it('userList returns a copy of users', async () => {
    vi.mocked(userAPI.getAll).mockResolvedValueOnce({ data: [mockUser] } as any);
    const store = useUsersStore();
    await store.getUsers();

    expect(store.userList).toEqual([mockUser]);
    expect(store.noUsers).toBe(false);
  });
});
