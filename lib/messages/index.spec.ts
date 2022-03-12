import * as allExports from '.';

const { CLIENT_NOT_FOUND, ...messages } = allExports;

describe('CLIENT_NOT_FOUND', () => {
    test('should return a string', () => {
        const namespace = 'client';
        expect(CLIENT_NOT_FOUND(namespace)).toContain(namespace);
        expect(CLIENT_NOT_FOUND(namespace)).toContain('Redis');
        expect(CLIENT_NOT_FOUND(namespace, false)).toContain(namespace);
        expect(CLIENT_NOT_FOUND(namespace, false)).toContain('Cluster');
    });
});

test('should be a string', () => {
    Object.values(messages).forEach(value => expect(typeof value).toBe('string'));
});
