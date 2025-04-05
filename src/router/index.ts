import { createRouter, createWebHistory } from 'vue-router';
import GeneralLayout from '@layouts/pages/GeneralLayout.vue';
import NotFound404 from '@/modules/common/pages/NotFound404.vue';
import isAdminGuard from '@/modules/auth/guards/is-admin.guard';
import isAuthenticatedGuard from '@/modules/auth/guards/is-authenticated.guard';

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
          name: 'cart',
          component: () => import('@cart/pages/CartView.vue'),
        },
        {
          path: 'carrito/pagar',
          beforeEnter: [isAuthenticatedGuard],
          name: 'pay',
          component: () => import('@cart/pages/PayView.vue'),
        },
        {
          path: '/gracias/:saleOrderId',
          beforeEnter: [isAuthenticatedGuard],
          name: 'thanks',
          component: () => import('@cart/pages/ThanksView.vue'),
        },
        {
          path: '/mis-compras',
          beforeEnter: [isAuthenticatedGuard],
          name: 'myPurchases',
          component: () => import('@/modules/cart/pages/MyPurchasesView.vue'),
        },
        {
          path: '/mis-compras/:saleId',
          beforeEnter: [isAuthenticatedGuard],
          name: 'purchaseInfo',
          component: () => import('@/modules/cart/pages/PurchaseView.vue'),
        },
        {
          path: '/politicas',
          component: () => import('@/modules/policies/layout/PoliciesLayout.vue'),
          children: [
            {
              path: 'reembolso',
              name: 'refundPolicy',
              component: () => import('@/modules/policies/pages/RefundPolicyView.vue'),
            },
            {
              path: 'devolucion',
              name: 'returnPolicy',
              component: () => import('@/modules/policies/pages/ReturnPolicyView.vue'),
            },
            {
              path: 'condiciones',
              name: 'termsAndQuestions',
              component: () => import('@/modules/policies/pages/TermsAndQuestionsView.vue'),
            },
            {
              path: 'privacidad',
              name: 'privacy',
              component: () => import('@/modules/policies/pages/PrivacyView.vue'),
            },
            {
              path: 'preguntas-frecuentes',
              name: 'frequentQuestions',
              component: () => import('@/modules/policies/pages/FrequentQuestionsView.vue'),
            },
          ],
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
      beforeEnter: [isAuthenticatedGuard, isAdminGuard],
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
          component: () => import('@/modules/admin/pages/SalesView.vue'),
        },
        {
          path: 'ventas/:saleId',
          name: 'adminSaleInfo',
          component: () => import('@/modules/admin/pages/SaleView.vue'),
        },
        {
          path: 'compras',
          name: 'purchases',
          component: () => import('@/modules/admin/pages/PurchasesView.vue'),
        },
        {
          path: 'productos',
          name: 'adminProducts',
          component: () => import('@/modules/admin/pages/ProductsView.vue'),
        },
        {
          path: 'productos/crear',
          name: 'adminCreateProduct',
          component: () => import('@/modules/product/pages/CreateProductView.vue'),
        },
        {
          path: 'productos/actualizar/:id',
          name: 'adminUpdateProducts',
          component: () => import('@/modules/product/pages/UpdateProductView.vue'),
        },
        {
          path: 'productos-destacados',
          name: 'adminFeaturedProducts',
          component: () => import('@/modules/featuredProducts/pages/FeaturedProductsView.vue'),
        },
        {
          path: 'categorias',
          name: 'adminCategories',
          component: () => import('@/modules/admin/pages/CategoriesView.vue'),
        },
        {
          path: 'categorias/crear',
          name: 'adminCreateCategory',
          component: () => import('@/modules/admin/pages/CreateCategoryView.vue'),
        },
        {
          path: 'categorias/actualizar/:id',
          name: 'adminUpdateCategory',
          component: () => import('@/modules/admin/pages/updateCategoryView.vue'),
        },
        {
          path: 'banners',
          name: 'adminBanners',
          component: () => import('@/modules/banner/pages/BannersView.vue'),
        },
        {
          path: 'banners/crear',
          name: 'adminCreateBanner',
          component: () => import('@/modules/banner/pages/CreateBannerView.vue'),
        },
        {
          path: 'banners/actualizar/:id',
          name: 'adminUpdateBanner',
          component: () => import('@/modules/banner/pages/UpdateBannerView.vue'),
        },
        {
          path: 'campaigns',
          name: 'adminCampaigns',
          component: () => import('@/modules/campaign/pages/CampaignsView.vue'),
        },
        {
          path: 'campaigns/crear',
          name: 'adminCreateCampaign',
          component: () => import('@/modules/campaign/pages/CreateCampaignView.vue'),
        },
        {
          path: 'campaigns/actualizar/:id',
          name: 'adminUpdateCampaign',
          component: () => import('@/modules/campaign/pages/UpdateCampaignView.vue'),
        },
        {
          path: 'codigos-descuento',
          name: 'adminDiscountCodes',
          component: () => import('@/modules/discountCode/pages/DiscountCodesView.vue'),
        },
        {
          path: 'codigos-descuento/crear',
          name: 'adminCreateDiscountCode',
          component: () => import('@/modules/discountCode/pages/CreateDiscountCode.vue'),
        },
        {
          path: 'codigos-descuento/actualizar/:id',
          name: 'adminUpdateDiscountCode',
          component: () => import('@/modules/discountCode/pages/UpdateDiscountCode.vue'),
        },
        {
          path: 'usuarios',
          name: 'adminUsers',
          component: () => import('@/modules/admin/pages/UsersView.vue'),
        },
      ],
    },

    // Not Found
    {
      path: '/:pathMatch(.*)*',
      component: NotFound404,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (!to.path.includes('auth')) localStorage.setItem('lastPath', to.path);
  next();
});
export default router;
