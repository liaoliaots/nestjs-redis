import { RedisError } from '.';

test('should be an instance of Error', () => {
    expect(new RedisError('')).toBeInstanceOf(Error);
});

test('the name should be equal to RedisError.name', () => {
    expect(new RedisError('').name).toBe(RedisError.name);
});

test('the message should be set correctly', () => {
    const message = 'a redis error';

    expect(() => {
        throw new RedisError(message);
    }).toThrow(message);
});

test('the stack should be set correctly', () => {
    expect(new RedisError('').stack).toBeDefined();
});
