// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import jest from 'eslint-plugin-jest';

const jestFiles = ['**/*.e2e-spec.ts', '**/*.spec.ts'];
export default tseslint.config(
  {
    ignores: ['packages/global.d.ts', '**/dist/', '**/*.mjs']
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    files: jestFiles,
    ...jest.configs['flat/recommended'],
    languageOptions: {
      globals: globals.jest
    }
  },
  {
    files: jestFiles,
    ...jest.configs['flat/style'],
    languageOptions: {
      globals: globals.jest
    }
  },
  eslintPluginPrettierRecommended,
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
    },
    languageOptions: {
      globals: {
        ...globals.node
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
);
