interface UserFactoryParams {
  id?: number;
  email?: string;
  isAdmin?: boolean;
  name?: string;
  verified?: boolean;
  carts?: any[];
}

export const buildUser = (params: UserFactoryParams = {}) => ({
  id: params.id ?? 1,
  email: params.email ?? 'test@example.com',
  isAdmin: params.isAdmin ?? false,
  name: params.name ?? 'Test User',
  verified: params.verified ?? true,
  carts: params.carts ?? [],
});
