import { parseNamespace } from './parsers';

describe('parseNamespace', () => {
  test('should work correctly', () => {
    const namespace1 = 'namespace';
    const namespace2 = Symbol('namespace');
    expect(parseNamespace(namespace1)).toBe(namespace1);
    expect(parseNamespace(namespace2)).toBe(namespace2.toString());
  });
});
