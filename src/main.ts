import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import GoogleSignInPlugin from 'vue3-google-signin';

// Tanstack query
import { VueQueryPlugin } from '@tanstack/vue-query';

// Firebase
import { VueFire, VueFireAuth } from 'vuefire';
import { firebaseApp } from './config/firebase';

import { plugin, defaultConfig } from '@formkit/vue';
import { useToast } from 'vue-toast-notification';
import config from '../formkit.config';

import App from './App.vue';
import router from './router';

import 'vue-toast-notification/dist/theme-sugar.css';

// Vueform
import Vueform from '@vueform/vueform';
import vueformConfig from './../vueform.config';

// Unhead
import { createHead } from '@unhead/vue/client';

// Directives
import ripple from './directives/ripple';
import '@/assets/ripple.css';

const $toast = useToast({
  duration: 5000,
  position: 'top-right',
});

const app = createApp(App);
const head = createHead();
app.directive('ripple', ripple);

app.provide('toast', $toast);

app.use(head);
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});
app.use(GoogleSignInPlugin, {
  clientId: '409428805948-oabs342a3r6b7e21q6922d5buubkiph0.apps.googleusercontent.com',
});

app.use(createPinia());
app.use(plugin, defaultConfig(config));
app.use(router);
app.use(VueQueryPlugin);
app.use(Vueform, vueformConfig);

app.mount('#app');
