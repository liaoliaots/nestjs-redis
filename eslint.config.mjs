import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
// @ts-ignore
import jest from 'eslint-plugin-jest';

const jestFiles = ['packages/*/test/**/*', 'packages/*/lib/**/*.spec.ts'];

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'packages/*/dist/', 'packages/*/*.mjs', 'packages/global.d.ts']
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
  prettierPlugin,
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
