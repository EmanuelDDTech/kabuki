import { generateClasses } from '@formkit/themes';

const config = {
  config: {
    classes: generateClasses({
      global: {
        wrapper: 'space-y-2 mb-2',
        message: 'text-red-500 text-sm pb-2 pl-2 mb-1 -mt-1',
        label: 'block text-gray-600',
        input:
          'w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500',
      },
      submit: {
        input:
          '$reset bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-bold w-full p-3 mt-10',
      },
    }),
  },
};

export default config;
