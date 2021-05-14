module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        project: 'tsconfig.json',
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
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
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: false,
                project: 'tsconfig.json'
            }
        }
    },
    reportUnusedDisableDirectives: true,
    rules: {
        'tsdoc/syntax': 'warn'
    }
};
