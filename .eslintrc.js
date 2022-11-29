/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@remix-run/eslint-config', '@remix-run/eslint-config/node', 'airbnb'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['airbnb-typescript'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
