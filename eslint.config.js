import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier/recommended';
// @ts-ignore
import jest from 'eslint-plugin-jest';

export default tseslint.config(
  {
    ignores: ['.prettierrc.js', 'eslint.config.js', 'sample', '**/dist', 'packages/*/*.js']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['packages/**/test/**', 'packages/**/*.spec.ts'],
    ...jest.configs['flat/recommended']
  },
  {
    files: ['packages/**/test/**', 'packages/**/*.spec.ts'],
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
        project: ['./packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  }
);
