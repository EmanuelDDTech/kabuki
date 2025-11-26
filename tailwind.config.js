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
      colors: {
        'shori-green': {
          50: '#c5ffd0',
          100: '#28fd77',
          200: '#21db66',
          300: '#1bbe57',
          400: '#16a34a',
          500: '#128e40',
          600: '#0c7232',
          700: '#065322',
          800: '#033413',
          900: '#011505',
        },
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
