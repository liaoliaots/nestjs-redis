import * as allExports from '.';

const { OPERATIONS_TIMEOUT, ...messages } = allExports;

describe('OPERATIONS_TIMEOUT', () => {
  test('should return a string', () => {
    expect(OPERATIONS_TIMEOUT(1)).toContain('1');
    expect(OPERATIONS_TIMEOUT(1)).toMatch(/\bmillisecond\b/);
    expect(OPERATIONS_TIMEOUT(2)).toContain('2');
    expect(OPERATIONS_TIMEOUT(2)).toMatch(/\bmilliseconds\b/);
  });
});

test('should be a string', () => {
  Object.values(messages).forEach(value => expect(typeof value).toBe('string'));
});
