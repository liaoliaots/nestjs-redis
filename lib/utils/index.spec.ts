import { parseNamespace } from '.';

describe('parseNamespace', () => {
    test('should work correctly', () => {
        const value1 = 'namespace';
        const value2 = Symbol('namespace');
        expect(parseNamespace(value1)).toBe(value1);
        expect(parseNamespace(value2)).toBe(value2.toString());
    });
});
