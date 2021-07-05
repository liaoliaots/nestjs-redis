import { parseNamespace, loadModule, checkPackages } from '.';

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

describe(`${loadModule.name}`, () => {
    test('if the module exists, the result should be defined', () => {
        expect(loadModule('ioredis')).toBeDefined();
        expect(loadModule('ioredis')).not.toBeNull();
    });

    test('if the module does not exist, the result should be null', () => {
        expect(loadModule('unknown')).toBeNull();
    });
});

describe(`${checkPackages.name}`, () => {
    test('the length should be 0', () => {
        expect(checkPackages(['ioredis', '@nestjs/terminus'])).toHaveLength(0);
    });

    test('the length should be 1', () => {
        expect(checkPackages(['ioredis', 'unknown'])).toHaveLength(1);
    });

    test('the length should be 2', () => {
        expect(checkPackages(['unknown', 'unknown'])).toHaveLength(2);
    });
});
