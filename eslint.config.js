import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'node_modules']),
  // Base configuration for all TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, eslintConfigPrettier],
  },
  // Client React application
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  // Node / Server & Config files
  {
    files: ['server/**/*.{ts,tsx}', '*.config.{js,ts,cjs}', 'commitlint.config.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]);
