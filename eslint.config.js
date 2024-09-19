import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import jest from 'eslint-plugin-jest';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
      ...jest.configs['flat/recommended']
    },
    {
      ...jest.configs['flat/style']
    },
    eslintPluginPrettierRecommended
  ],
  languageOptions: {
    parserOptions: {
      project: ['./packages/*/tsconfig.json'],
      tsconfigRootDir: import.meta.dirname
    },
    ecmaVersion: 2023,
    sourceType: 'commonjs',
    globals: {
      ...globals.node,
      ...globals.jest
    }
  },
  ignores: ['.prettierrc.js', 'eslint.config.js', '**/dist/**/*']
});
