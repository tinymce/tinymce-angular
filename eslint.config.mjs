// eslint.config.js
import { defineConfig } from 'eslint/config';
import tinymceEslintPlugin from '@tinymce/eslint-plugin';
import js from '@eslint/js';

import pluginChaiFriendly from 'eslint-plugin-chai-friendly';

export default defineConfig([
	{
    plugins: {
        '@tinymce': tinymceEslintPlugin
    },
    extends: [ '@tinymce/standard' ],
    files: [
      'tinymce-angular-component/src/**/*.ts',
      'stories/**/*.ts'
    ],
    ignores: [
      'src/demo/demo.ts'
    ],
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        project: [
            './tsconfig.json'
        ]
      },
    },
    rules: {
      '@tinymce/prefer-fun': 'off',
      'no-underscore-dangle': 'off',
      '@typescript-eslint/member-ordering': 'off',
    }
  },
  {
    files: [
      '**/*.js'
    ],
    env: {
      es6: true,
      node: true,
      browser: true
    },
    plugins: { js },
    extends: [ 'js/recommended' ],
    parser: 'espree',
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
    },
    rules: {
      'indent': [ 'error', 2, { 'SwitchCase': 1 } ],
      'no-shadow': 'error',
      'no-unused-vars': [ 'error', { 'argsIgnorePattern': '^_' } ],
      'object-curly-spacing': [ 'error', 'always', { 'arraysInObjects': false, 'objectsInObjects': false } ],
      'quotes': [ 'error', 'single' ],
      'semi': 'error'
    }
  },
  {
    files: [
      '**/*Test.ts',
      '**/test/**/*.ts'
    ],
    plugins: {
      'chai-friendly': pluginChaiFriendly
    },
    rules: {
      'no-unused-expressions': 'off',
      'no-console': 'off',
      'max-classes-per-file': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off'
    }
  }
]);
