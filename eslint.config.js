const globals = require('globals');
const pluginJest = require('eslint-plugin-jest');

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
   {
      files: ['**/*.test.js'],
      plugins: { jest: pluginJest },
      languageOptions: {
         globals: pluginJest.environments.globals.globals,
      },
      rules: {
         'jest/no-disabled-tests': 'warn',
         'jest/no-focused-tests': 'error',
         'jest/no-identical-title': 'error',
         'jest/prefer-to-have-length': 'warn',
         'jest/valid-expect': 'error',
      },
   },
];
