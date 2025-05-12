import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import { defineConfig } from 'eslint-define-config'

// Sử dụng default import thay vì named import cho @typescript-eslint/parser
import * as parser from '@typescript-eslint/parser'

export default defineConfig({
  languageOptions: {
    parser: parser.default, // Đảm bảo sử dụng default export từ parser
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
  },
  plugins: {
    '@typescript-eslint': typescriptPlugin,
    react: eslintPluginReact,
    'react-hooks': eslintPluginReactHooks,
    prettier: eslintPluginPrettier,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        semi: false,
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignores: ['dist/', 'node_modules/'],
})
