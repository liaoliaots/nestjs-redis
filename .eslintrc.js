module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
            impliedStrict: true
        },
        project: './tsconfig.json'
    },
    plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:eslint-comments/recommended',
        'plugin:jest/recommended',
        'plugin:jest/style',
        'plugin:prettier/recommended'
    ],
    root: true,
    env: {
        node: true,
        jest: true,
        es2021: true
    },
    ignorePatterns: ['dist/*', '.eslintrc.js', 'health.ts', 'health.js', 'health.d.ts'],
    reportUnusedDisableDirectives: true,
    rules: {
        'tsdoc/syntax': 'warn'
    }
};
