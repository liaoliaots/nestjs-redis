import { READY_LOG, ERROR_LOG } from '.';

describe('READY_LOG', () => {
  test('should return a string', () => {
    expect(READY_LOG('name')).toBe(`name: connected successfully to the server`);
  });
});

describe('ERROR_LOG', () => {
  test('should return a string', () => {
    expect(ERROR_LOG('name', 'message')).toBe(`name: message`);
  });
});
