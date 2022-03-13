import { promiseTimeout } from './promise-timeout';
import { OPERATIONS_TIMEOUT } from '@/messages';

describe('promiseTimeout', () => {
    let timer: NodeJS.Timeout;
    const getPromise = (ms: number) => {
        return new Promise<string>(resolve => {
            timer = setTimeout(() => resolve('response'), ms);
        });
    };

    afterEach(() => {
        clearTimeout(timer);
    });

    test('should work correctly', async () => {
        await expect(promiseTimeout(20, getPromise(10))).resolves.toBe('response');
    });

    test('should throw an error', async () => {
        await expect(promiseTimeout(10, getPromise(20))).rejects.toThrow(OPERATIONS_TIMEOUT(10));
    });
});
