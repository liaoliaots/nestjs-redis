import { RedisError } from '.';

const message = 'a redis error';

describe('name', () => {
    test('the name should be equal to RedisError.name', () => {
        expect(new RedisError(message).name).toBe(RedisError.name);
    });
});

describe('message', () => {
    test('the message should be set correctly', () => {
        expect(() => {
            throw new RedisError(message);
        }).toThrow(message);
    });
});

describe('stack', () => {
    test('the stack should be set correctly', () => {
        expect(new RedisError(message).stack).toBeDefined();
    });
});
