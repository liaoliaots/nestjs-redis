import * as constants from './cluster.constants';

test('each of constants should be defined', () => {
    Object.values(constants).forEach(value => expect(value).toBeDefined());
});
