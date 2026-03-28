import { mount, type MountingOptions } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import type { DefineComponent } from 'vue';

export const mountWithPinia = (component: DefineComponent, options: MountingOptions<any> = {}) => {
  const pinia = createPinia();
  setActivePinia(pinia);

  return mount(component, {
    ...options,
    global: {
      ...(options.global ?? {}),
      plugins: [...(options.global?.plugins ?? []), pinia],
    },
  });
};
