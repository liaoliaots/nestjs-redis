import { CLIENT_NOT_FOUND, MISSING_CONFIGURATION, FAILED_CLUSTER_STATE } from '.';

describe('MISSING_CONFIGURATION', () => {
    test('should get a string', () => {
        expect(MISSING_CONFIGURATION).toBeDefined();
    });
});

describe('FAILED_CLUSTER_STATE', () => {
    test('should get a string', () => {
        expect(FAILED_CLUSTER_STATE).toBeDefined();
    });
});

describe(`${CLIENT_NOT_FOUND.name}`, () => {
    test('should get a string that contains a specified string', () => {
        const namespace = 'client0';

        expect(CLIENT_NOT_FOUND(namespace)).toContain(namespace);
        expect(CLIENT_NOT_FOUND(namespace)).toContain('redis');
        expect(CLIENT_NOT_FOUND(namespace, true)).toContain('cluster');
    });
});
