import { parseNamespace } from '.';

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
