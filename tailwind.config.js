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
    },
  },
  plugins: [require('@vueform/vueform/tailwind')],
  // plugins: [
  //   // eslint-disable-next-line no-undef
  //   require('daisyui'),
  // ],
  // daisyui: {
  //   themes: ['light', 'dark', 'cupcake'],
  // },
};
