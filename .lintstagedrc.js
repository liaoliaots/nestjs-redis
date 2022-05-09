module.exports = {
    '{lib,test}/**/*.ts': ['prettier --write', 'eslint', () => 'tsc -p tsconfig.json --noEmit']
};
