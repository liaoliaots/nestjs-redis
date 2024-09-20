import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier/recommended';
// @ts-ignore
import jest from 'eslint-plugin-jest';

const jestFiles = ['packages/*/test/**/*', 'packages/**/*.spec.ts'];

export default tseslint.config(
  {
    ignores: ['eslint.config.js', 'packages/*/dist/', 'packages/*/*.js']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: jestFiles,
    ...jest.configs['flat/recommended']
  },
  {
    files: jestFiles,
    ...jest.configs['flat/style']
  },
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      parserOptions: {
        ecmaVersion: 'latest',
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  }
);
