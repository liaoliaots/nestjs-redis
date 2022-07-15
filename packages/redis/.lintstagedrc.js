module.exports = {
  '{lib,test}/**/*.ts': [() => 'tsc -p tsconfig.json --noEmit']
};
