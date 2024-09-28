export default {
  '*.ts': [
    'prettier --write',
    'eslint "lib/**" --ignore-pattern "lib/**/*.spec.ts"',
    () => 'tsc --project tsconfig.build.json --noEmit'
  ]
};
