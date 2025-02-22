/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}', './formkit.config.ts'],
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
  // plugins: [
  //   // eslint-disable-next-line no-undef
  //   require('daisyui'),
  // ],
  // daisyui: {
  //   themes: ['light', 'dark', 'cupcake'],
  // },
};
