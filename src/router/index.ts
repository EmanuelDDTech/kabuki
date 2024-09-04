import { createRouter, createWebHistory } from 'vue-router';
import GeneralLayout from '@layouts/pages/GeneralLayout.vue';

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
      ],
    },
  ],
});

export default router;
