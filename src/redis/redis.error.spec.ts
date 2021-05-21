import { RedisError } from './redis.error';

test('should not fail if RedisError set message properly', () => {
    const message = 'a redis error';

    const mockThrow = jest.fn(() => {
        throw new RedisError(message);
    });

    expect(() => mockThrow()).toThrow(message);
});
