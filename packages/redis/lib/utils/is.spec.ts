import { isString, isError } from './is';

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

describe('isError', () => {
  test('should work correctly', () => {
    class CustomError extends Error {}
    class User {}

    expect(isError(new Error())).toBe(true);
    expect(isError(new CustomError())).toBe(true);
    expect(isError(new User())).toBe(false);
    expect(isError('')).toBe(false);
    expect(isError(0)).toBe(false);
    expect(isError(true)).toBe(false);
    expect(isError(undefined)).toBe(false);
    expect(isError(null)).toBe(false);
    expect(isError(Symbol())).toBe(false);
  });
});
