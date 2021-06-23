module.exports = {
    '*.ts': ['prettier --write', () => 'tsc -p tsconfig.json --noEmit', 'eslint --ext .ts']
};
