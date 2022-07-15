module.exports = {
  '{lib,test}/**/*.ts': ['prettier --write', 'eslint', () => 'tsc -p tsconfig.build.json --noEmit']
};
