import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useUserStore } from '../stores/user';

const isAdminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const userStore = useUserStore();

  await userStore.checkAuthStatus();

  if (userStore.isAdmin) next();
  else next({ name: 'home' });
};

export default isAdminGuard;
