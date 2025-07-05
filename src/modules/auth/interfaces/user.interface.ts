import type { Cart } from '@/modules/cart/interfaces/cart.interface';

export interface User {
  id: number;
  email: string;
  isAdmin: string;
  name: string;
  verified: boolean;
  carts: Cart[];
}
