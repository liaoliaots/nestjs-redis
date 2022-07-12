import * as allExports from '.';

const { READY_LOG, ERROR_LOG, ...messages } = allExports;

describe('READY_LOG', () => {
  test('should return a string', () => {
    expect(READY_LOG('name')).toBe(`name: ${messages.CONNECTED_SUCCESSFULLY}`);
  });
});

describe('ERROR_LOG', () => {
  test('should return a string', () => {
    expect(ERROR_LOG('name', 'message')).toBe(`name: message`);
  });
});

test('should be a string', () => {
  Object.values(messages).forEach(value => expect(typeof value).toBe('string'));
});
