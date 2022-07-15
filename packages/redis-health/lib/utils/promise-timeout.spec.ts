import { promiseTimeout } from './promise-timeout';
import { OPERATIONS_TIMEOUT } from '@health/messages';

describe('promiseTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  const waitPromise = (ms: number) =>
    new Promise<string>(resolve => {
      setTimeout(() => resolve('response'), ms);
    });

  test('should work correctly', async () => {
    const promise = promiseTimeout(2000, waitPromise(1000));
    jest.runAllTimers();
    await expect(promise).resolves.toBe('response');
  });

  test('should throw an error', async () => {
    const promise = promiseTimeout(2000, waitPromise(3000));
    jest.runAllTimers();
    await expect(promise).rejects.toThrow(OPERATIONS_TIMEOUT(2000));
  });
});
