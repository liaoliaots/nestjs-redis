import { RedisError } from './redis.error';

const message = 'a redis error';

describe('name', () => {
    test('the name should be set properly', () => {
        expect(new RedisError(message).name).toBe(RedisError.name);
    });
});

describe('message', () => {
    test('the message should be set properly', () => {
        expect(() => {
            throw new RedisError(message);
        }).toThrow(message);
    });
});

describe('stack', () => {
    test('the stack should be set properly', () => {
        expect(new RedisError(message).stack).toBeDefined();
    });
});
