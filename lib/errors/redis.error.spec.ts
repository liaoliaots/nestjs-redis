import { RedisError } from './redis.error';

describe('RedisError', () => {
    test('should work correctly', () => {
        const message = 'a redis error';
        expect(new RedisError(message)).toBeInstanceOf(Error);
        expect(new RedisError(message).name).toBe(RedisError.name);
        expect(new RedisError(message).message).toBe(message);
        expect(new RedisError(message).stack).toBeDefined();
    });
});
