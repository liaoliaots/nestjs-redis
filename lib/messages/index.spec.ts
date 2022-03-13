import * as allExports from '.';

const { CLIENT_NOT_FOUND, OPERATIONS_TIMEOUT, ...messages } = allExports;

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

test('should be a string', () => {
    Object.values(messages).forEach(value => expect(typeof value).toBe('string'));
});
