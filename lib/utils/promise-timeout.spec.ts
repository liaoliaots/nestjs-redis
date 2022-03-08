import { promiseTimeout } from './promise-timeout';

describe('promiseTimeout', () => {
    let timer: NodeJS.Timeout;

    afterEach(() => {
        clearTimeout(timer);
    });

    test('should work correctly', async () => {
        const p = new Promise<string>(resolve => {
            timer = setTimeout(() => resolve('response'), 50);
        });
        await expect(promiseTimeout(100, p)).resolves.toBe('response');
    });
});
