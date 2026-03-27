import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
      testTimeout: 15000,
      exclude: [...configDefaults.exclude, 'e2e/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*.{ts,tsx,vue}'],
        exclude: ['src/**/*.d.ts', 'src/main.ts', 'src/vite-env.d.ts'],
        thresholds: {
          lines: 70,
          branches: 60,
          functions: 70,
          statements: 70,
        },
      },
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
);
