module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  globals: {
    wx: 'readonly',
    App: 'readonly',
    Page: 'readonly',
    Component: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly',
    Behavior: 'readonly',
  },
  extends: ['eslint:recommended', 'prettier'],
  ignorePatterns: [
    'miniprogram_npm/**',
    'node_modules/**',
    'cloudfunctions/**/node_modules/**',
    'scripts/**',
  ],
  overrides: [
    {
      files: ['*.wxs'],
      parserOptions: {
        ecmaVersion: 5,
        sourceType: 'script',
      },
    },
    {
      files: ['cloudfunctions/**/*.js'],
      env: {
        browser: false,
        node: true,
      },
      globals: {
        wx: 'readonly',
      },
    },
  ],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
};
