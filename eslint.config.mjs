import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import jest from 'eslint-plugin-jest';

const jestFiles = ['**/*.e2e-spec.ts', '**/*.spec.ts'];

export default ts.config(
  {
    ignores: ['packages/global.d.ts', '**/dist/', '**/*.mjs']
  },
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  ...ts.configs.stylisticTypeChecked,
  {
    files: jestFiles,
    ...jest.configs['flat/recommended']
  },
  {
    files: jestFiles,
    ...jest.configs['flat/style']
  },
  prettierRecommended,
  {
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      parserOptions: {
        sourceType: 'commonjs',
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
);
