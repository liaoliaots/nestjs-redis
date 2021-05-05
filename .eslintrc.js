module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        project: 'tsconfig.json',
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint', 'functional'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:functional/external-recommended',
        'plugin:functional/recommended',
        'plugin:functional/stylitic',
        'plugin:eslint-comments/recommended',
        'plugin:prettier/recommended'
    ],
    root: true,
    env: {
        node: true,
        jest: true,
        es2020: true
    },
    ignorePatterns: ['.eslintrc.js', 'dist/*'],
    reportUnusedDisableDirectives: true,
    rules: {}
};
