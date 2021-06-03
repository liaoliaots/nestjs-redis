import * as constants from './redis.constants';

test('each of the constants should be defined', () => {
    Object.values(constants).forEach(value => expect(value).toBeDefined());
});
