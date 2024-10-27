import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import AuthAPI from '../api/AuthAPI';

const isAdminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  try {
    await AuthAPI.isAdmin();
    return next();
  } catch (error) {
    return next({ name: 'home' });
  }
};

export default isAdminGuard;
