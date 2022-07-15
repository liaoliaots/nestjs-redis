module.exports = {
  'packages/redis/**/*.ts': ['prettier --write', 'eslint', () => 'tsc -p packages/redis/tsconfig.json --noEmit']
};
