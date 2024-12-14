export default {
  '*.ts': [
    'prettier --write',
    'eslint --ignore-pattern "test/" --ignore-pattern "**/*.spec.ts"',
    () => 'tsc --project tsconfig.build.json --noEmit'
  ]
};
