import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import GoogleSignInPlugin from 'vue3-google-signin';

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
app.use(GoogleSignInPlugin, {
  clientId: '409428805948-oabs342a3r6b7e21q6922d5buubkiph0.apps.googleusercontent.com',
});

app.use(createPinia());
app.use(plugin, defaultConfig(config));
app.use(router);

app.mount('#app');
