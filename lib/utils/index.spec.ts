import { parseNamespace, isString, isSymbol } from '.';

describe('parseNamespace', () => {
    test('should work correctly', () => {
        const value1 = 'namespace';
        const value2 = Symbol('namespace');
        expect(parseNamespace(value1)).toBe(value1);
        expect(parseNamespace(value2)).toBe(value2.toString());
    });
});

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
