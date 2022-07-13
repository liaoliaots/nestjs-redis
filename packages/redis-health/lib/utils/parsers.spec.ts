import { removeLineBreaks, parseUsedMemory } from './parsers';

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
    const info = '# Memory used_memory:102400 used_memory_human:100K';
    expect(parseUsedMemory(info)).toBe(102400);
  });
});
