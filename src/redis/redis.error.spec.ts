import { RedisError } from './redis.error';

const message = 'a redis error';

describe('message', () => {
    test('the message should be defined', () => {
        expect(typeof new RedisError(message).message).toBe('string');
    });

    test('the message should be set properly', () => {
        const mockThrow = jest.fn(() => {
            throw new RedisError(message);
        });

        expect(() => mockThrow()).toThrow(message);
    });
});

describe('name', () => {
    test('the name should be defined', () => {
        expect(typeof new RedisError(message).name).toBe('string');
    });

    test('the name should be set properly', () => {
        expect(new RedisError(message).name).toBe(RedisError.name);
    });
});

describe('stack', () => {
    test('the stack should be defined', () => {
        expect(typeof new RedisError(message).stack).toBe('string');
    });
});
