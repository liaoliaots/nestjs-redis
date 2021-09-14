module.exports = {
    '{lib,test}/**/*.ts': ['prettier --write', () => 'tsc -p tsconfig.json --noEmit', 'eslint']
};
