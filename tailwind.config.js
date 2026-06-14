/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,vue}',
    './formkit.config.ts',
    './vueform.config.js', // or where `vueform.config.js` is located. Change `.js` to `.ts` if required.
    './node_modules/@vueform/vueform/themes/tailwind/**/*.vue',
    './node_modules/@vueform/vueform/themes/tailwind/**/*.js',
  ],
  theme: {
    extend: {
      fontSize: {
        'body-small': ['var(--text-small)', { lineHeight: '1.4' }],
        'body-normal': ['var(--text-normal)', { lineHeight: '1.5' }],
        'title-6': ['var(--title-6)', { lineHeight: '1.25' }],
        'title-5': ['var(--title-5)', { lineHeight: '1.2' }],
        'title-4': ['var(--title-4)', { lineHeight: '1.2' }],
        'title-3': ['var(--title-3)', { lineHeight: '1.15' }],
        'title-2': ['var(--title-2)', { lineHeight: '1.1' }],
        'title-1': ['var(--title-1)', { lineHeight: '1.05' }],
      },
      keyframes: {
        customBounce: {
          '0%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-5%)' },
          '100%': { transform: 'translateY(0%)' },
        },
      },
      animation: {
        customBounce: 'customBounce 1s infinite',
      },
      colors: {
        'shori-green': {
          1: 'var(--green-1)',
          2: 'var(--green-2)',
          3: 'var(--green-3)',
          4: 'var(--green-4)',
          5: 'var(--green-5)',
          6: 'var(--green-6)',
          7: 'var(--green-7)',
          8: 'var(--green-8)',
          9: 'var(--green-9)',
          10: 'var(--green-10)',
          11: 'var(--green-11)',
          12: 'var(--green-12)',

          contrast: 'var(--green-contrast)',
          surface: 'var(--green-surface)',
          indicator: 'var(--green-contrast)',
          track: 'var(--green-track)',
        },
        'shori-gray': {
          1: 'var(--gray-1)',
          2: 'var(--gray-2)',
          3: 'var(--gray-3)',
          4: 'var(--gray-4)',
          5: 'var(--gray-5)',
          6: 'var(--gray-6)',
          7: 'var(--gray-7)',
          8: 'var(--gray-8)',
          9: 'var(--gray-9)',
          10: 'var(--gray-10)',
          11: 'var(--gray-11)',
          12: 'var(--gray-12)',

          contrast: 'var(--gray-contrast)',
          surface: 'var(--gray-surface)',
          indicator: 'var(--gray-contrast)',
          track: 'var(--gray-track)',
        },
        'shori-bg': 'var(--color-background)',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('@vueform/vueform/tailwind'),
    // eslint-disable-next-line no-undef
    require('tailwind-scrollbar'),
  ],
  // plugins: [
  //   // eslint-disable-next-line no-undef
  //   require('daisyui'),
  // ],
  // daisyui: {
  //   themes: ['light', 'dark', 'cupcake'],
  // },
};
