import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

// Firebase
import { VueFire, VueFireAuth } from 'vuefire';
import { firebaseApp } from './config/firebase';

import { plugin, defaultConfig } from '@formkit/vue';
import { useToast } from 'vue-toast-notification';
import config from '../formkit.config';

import App from './App.vue';
import router from './router';

import 'vue-toast-notification/dist/theme-sugar.css';

const $toast = useToast({
  duration: 5000,
  position: 'top-right',
});

const app = createApp(App);

app.provide('toast', $toast);

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});

app.use(createPinia());
app.use(plugin, defaultConfig(config));
app.use(router);

app.mount('#app');
