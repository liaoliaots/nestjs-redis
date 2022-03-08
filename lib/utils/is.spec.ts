import IORedis from 'ioredis';
import { isString, isSymbol, isError, isResolution, isRejection, isDirectInstanceOf } from './is';

describe('isString', () => {
    test('should work correctly', () => {
        expect(isString('')).toBe(true);
        expect(isString('a')).toBe(true);
        expect(isString(1)).toBe(false);
        expect(isString(true)).toBe(false);
        expect(isString(undefined)).toBe(false);
        expect(isString(null)).toBe(false);
        expect(isString(Symbol())).toBe(false);
    });
});

describe('isSymbol', () => {
    test('should work correctly', () => {
        expect(isSymbol(Symbol())).toBe(true);
        expect(isSymbol('')).toBe(false);
        expect(isSymbol(1)).toBe(false);
        expect(isSymbol(true)).toBe(false);
        expect(isSymbol(undefined)).toBe(false);
        expect(isSymbol(null)).toBe(false);
    });
});

describe('isError', () => {
    test('should work correctly', () => {
        class RedisError extends Error {}
        class UnknownError {}

        const err1 = new Error();
        const err2 = new RedisError();
        const err3 = new UnknownError();
        expect(isError(err1)).toBe(true);
        expect(isError(err2)).toBe(true);
        expect(isError(err3)).toBe(false);
        expect(isError('')).toBe(false);
        expect(isError(1)).toBe(false);
        expect(isError(true)).toBe(false);
        expect(isError(undefined)).toBe(false);
        expect(isError(null)).toBe(false);
        expect(isError(Symbol())).toBe(false);
    });
});

describe('isResolution', () => {
    test('should work correctly', () => {
        expect(isResolution({ status: 'fulfilled', value: '' })).toBe(true);
        expect(isResolution({ status: 'rejected', reason: '' })).toBe(false);
    });
});

describe('isRejection', () => {
    test('should work correctly', () => {
        expect(isRejection({ status: 'fulfilled', value: '' })).toBe(false);
        expect(isRejection({ status: 'rejected', reason: '' })).toBe(true);
    });
});

describe('isDirectInstanceOf', () => {
    test('should work correctly', () => {
        class Unknown {}

        const c1 = new IORedis();
        const c2 = new IORedis.Cluster([]);
        expect(isDirectInstanceOf(c1, IORedis)).toBe(true);
        expect(isDirectInstanceOf(c2, IORedis.Cluster)).toBe(true);
        expect(isDirectInstanceOf(new Unknown(), Unknown)).toBe(true);
        expect(isDirectInstanceOf(new Unknown(), Object)).toBe(false);
    });
});
