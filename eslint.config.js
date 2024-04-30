const globals = require('globals');

module.exports = [
   {
      plugins: {
         extends: ['eslint:recommended', 'plugin:node/recommended'],
      },
      languageOptions: {
         parserOptions: {
            ecmaVersion: 2020,
         },
         globals: {
            ...globals.browser,
         },
      },
   },
];
