import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import AuthAPI from '../api/AuthAPI';

const isAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  try {
    await AuthAPI.auth();
    return next();
  } catch (error) {
    return next({ name: 'login' });
  }
};

export default isAuthenticatedGuard;
