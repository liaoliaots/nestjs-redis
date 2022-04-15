import * as allExports from '.';

const { CLIENT_NOT_FOUND, OPERATIONS_TIMEOUT, READY_LOG, ERROR_LOG, ...messages } = allExports;

describe('CLIENT_NOT_FOUND', () => {
    test('should return a string', () => {
        const namespace = 'name';
        expect(CLIENT_NOT_FOUND(namespace)).toContain(namespace);
        expect(CLIENT_NOT_FOUND(namespace)).toContain('Redis');
        expect(CLIENT_NOT_FOUND(namespace, false)).toContain(namespace);
        expect(CLIENT_NOT_FOUND(namespace, false)).toContain('Cluster');
    });
});

describe('OPERATIONS_TIMEOUT', () => {
    test('should return a string', () => {
        expect(OPERATIONS_TIMEOUT(100)).toContain('100');
    });
});

describe('READY_LOG', () => {
    test('should return a string', () => {
        expect(READY_LOG('name')).toBe(`name: ${messages.CONNECTED_SUCCESSFULLY}`);
    });
});

describe('ERROR_LOG', () => {
    test('should return a string', () => {
        expect(ERROR_LOG({ namespace: 'name', error: new Error('custom') })).toBe(`name: custom`);
    });
});

test('should be a string', () => {
    Object.values(messages).forEach(value => expect(typeof value).toBe('string'));
});
