module.exports = {
    '*.ts': ['prettier --write', () => 'tsc -p tsconfig.build.json --noEmit', 'eslint --ext .ts']
};
