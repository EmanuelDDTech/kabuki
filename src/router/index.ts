import { createRouter, createWebHistory } from 'vue-router';
import GeneralLayout from '@layouts/pages/GeneralLayout.vue';
import NotFound404 from '@/modules/common/pages/NotFound404.vue';
import isAuthenticatedGuard from '@/modules/auth/guards/is-authenticated.guard';
import AuthAPI from '@/modules/auth/api/AuthAPI';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: GeneralLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@layouts/pages/HomeView.vue'),
        },
        {
          path: '/productos',
          name: 'products',
          component: () => import('@products/pages/ProductsView.vue'),
        },
        {
          path: '/producto/:id',
          name: 'product',
          component: () => import('@products/pages/ProductView.vue'),
        },
        {
          path: '/carrito',
          meta: { requiresAuth: true },
          name: 'cart',
          component: () => import('@cart/pages/CartView.vue'),
        },
        {
          path: '/pagar',
          meta: { requiresAuth: true },
          name: 'pay',
          component: () => import('@cart/pages/PayView.vue'),
        },
      ],
    },

    {
      path: '/auth',
      redirect: { name: 'login' },
      name: 'auth',
      component: () => import('@/modules/auth/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/modules/auth/pages/LoginPage.vue'),
        },
        {
          path: 'registro',
          name: 'register',
          component: () => import('@/modules/auth/pages/RegisterPage.vue'),
        },
        {
          path: 'confirmar-cuenta/:token',
          name: 'confirm-account',
          component: () => import('@/modules/auth/pages/ConfirmAccountPage.vue'),
        },
      ],
    },

    {
      path: '/admin',
      redirect: { name: 'adminDashboard' },
      name: 'admin',
      component: () => import('@/modules/admin/layouts/AdminLayout.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'adminDashboard',
          component: () => import('@/modules/admin/pages/AdminDashboard.vue'),
        },
        {
          path: 'ventas',
          name: 'sales',
          component: () => import('@/modules/admin/pages/AdminDashboard.vue'),
        },
        {
          path: 'compras',
          name: 'purchases',
          component: () => import('@/modules/admin/pages/AdminDashboard.vue'),
        },
        {
          path: 'productos',
          name: 'adminProducts',
          component: () => import('@/modules/admin/pages/ProductosView.vue'),
        },
        {
          path: 'usuarios',
          name: 'adminUsers',
          component: () => import('@/modules/admin/pages/AdminDashboard.vue'),
        },
      ],
    },

    // Not Found
    {
      path: '/:pathMatch(.*)*',
      //redirect: '/',
      component: NotFound404,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((url) => url.meta.requiresAuth);
  if (!to.path.includes('auth')) localStorage.setItem('lastPath', to.path);
  if (requiresAuth) {
    try {
      await AuthAPI.auth();
      next();
    } catch (error) {
      next({ name: 'login' });
    }
  } else {
    next();
  }
});
export default router;
