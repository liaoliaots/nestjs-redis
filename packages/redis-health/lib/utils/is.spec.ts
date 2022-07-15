import { isNullish } from './is';

describe('isNullish', () => {
  test('should work correctly', () => {
    expect(isNullish(undefined)).toBe(true);
    expect(isNullish(null)).toBe(true);
    expect(isNullish(NaN)).toBe(false);
    expect(isNullish(false)).toBe(false);
    expect(isNullish('')).toBe(false);
    expect(isNullish(0)).toBe(false);
    expect(isNullish(1)).toBe(false);
  });
});
