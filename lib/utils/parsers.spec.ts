import { parseNamespace, removeLineBreaks, parseUsedMemory } from './parsers';

describe('parseNamespace', () => {
    test('should work correctly', () => {
        const namespace1 = 'namespace';
        const namespace2 = Symbol('namespace');
        expect(parseNamespace(namespace1)).toBe(namespace1);
        expect(parseNamespace(namespace2)).toBe(namespace2.toString());
    });
});

describe('removeLineBreaks', () => {
    test('should work correctly', () => {
        const text = `Here's some text.
        It has some line breaks that will be removed
        using Javascript.`;
        expect(removeLineBreaks(text)).toBe(
            "Here's some text. It has some line breaks that will be removed using Javascript."
        );
    });
});

describe('parseUsedMemory', () => {
    test('should work correctly', () => {
        const info = '# Memory used_memory:894952 used_memory_human:873.98K';
        expect(parseUsedMemory(info)).toBe(894952);
    });
});
