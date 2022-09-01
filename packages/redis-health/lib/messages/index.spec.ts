import * as allExports from '.';

const { OPERATIONS_TIMEOUT, ...messages } = allExports;

describe('OPERATIONS_TIMEOUT', () => {
  test('should return a string', () => {
    expect(OPERATIONS_TIMEOUT(1000)).toContain('1000');
    expect(OPERATIONS_TIMEOUT(2000)).toContain('2000');
  });
});

test('should be a string', () => {
  Object.values(messages).forEach(value => expect(typeof value).toBe('string'));
});
