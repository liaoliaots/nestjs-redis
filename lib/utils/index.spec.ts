import { promiseTimeout, testConfig, parseNamespace } from '.';
import { RedisError } from '../errors';

describe(`${promiseTimeout.name}`, () => {
    const timeout = () =>
        new Promise<undefined>(resolve => {
            const id = setTimeout(() => {
                clearTimeout(id);
                resolve(undefined);
            }, 10);
        });

    test('should resolve promise when the time of executing promise less than ms', () => {
        return expect(promiseTimeout(20, timeout())).resolves.toBeUndefined();
    });

    test('should reject promise when the time of executing promise greater than ms', () => {
        return expect(promiseTimeout(0, timeout())).rejects.toBeInstanceOf(RedisError);
    });
});

describe(`${parseNamespace.name}`, () => {
    test('if value is a string, the result should be equal to this string', () => {
        const value = 'namespace';

        expect(parseNamespace(value)).toBe(value);
    });

    test('if value is a symbol, the result should be equal to symbol.toString()', () => {
        const value = Symbol('namespace');

        expect(parseNamespace(value)).toBe(value.toString());
    });

    test('if value is neither string nor symbol, the result should be unknown', () => {
        expect(parseNamespace(undefined)).toBe('unknown');
        expect(parseNamespace(null)).toBe('unknown');
        expect(parseNamespace(false)).toBe('unknown');
        expect(parseNamespace(0)).toBe('unknown');
    });
});

describe('testConfig', () => {
    test('the host should be of type string', () => {
        expect(typeof testConfig.host).toBe('string');
    });

    test('the port should be of type number', () => {
        expect(typeof testConfig.port).toBe('number');
    });

    test('the password should be of type string or undefined', () => {
        expect(typeof testConfig.password === 'string' || typeof testConfig.password === 'undefined').toBe(true);
    });
});
