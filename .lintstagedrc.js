module.exports = {
    '*.ts': ['prettier --write', () => 'tsc -p tsconfig.build.json --noEmit --incremental false', 'eslint --ext .ts']
};
