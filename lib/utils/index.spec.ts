import { promiseTimeout, testConfig } from '.';
import { RedisError } from '../errors';

describe(`${promiseTimeout.name}`, () => {
    test('should resolve promise when the time of executing promise less than ms', () => {
        const promise = new Promise<string>(resolve => {
            const id = setTimeout(() => {
                clearTimeout(id);
                resolve('resolved');
            }, 10);
        });

        return expect(promiseTimeout(20, promise)).resolves.toBe('resolved');
    });

    test('should reject promise when the time of executing promise greater than ms', () => {
        const promise = new Promise<string>(resolve => {
            const id = setTimeout(() => {
                clearTimeout(id);
                resolve('resolved');
            }, 30);
        });

        return expect(promiseTimeout(20, promise)).rejects.toBeInstanceOf(RedisError);
    });
});

describe('testConfig', () => {
    test('the host should be of type string', () => {
        expect(typeof testConfig.host).toBe('string');
    });

    test('the port should be of type number', () => {
        expect(typeof testConfig.port).toBe('number');
    });

    test('the password should be of type string', () => {
        expect(typeof testConfig.password === 'string' || typeof testConfig.password === 'undefined').toBe(true);
    });
});
