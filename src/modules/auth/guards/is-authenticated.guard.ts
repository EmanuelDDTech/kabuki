import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useUserStore } from '../stores/user';
import { AuthStatus } from '../interfaces';

const isAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const userStore = useUserStore();

  await userStore.checkAuthStatus();

  if (userStore.isUnauthenticated) next({ name: 'home' });
  else next();
};

export default isAuthenticatedGuard;
