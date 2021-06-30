import { CLIENT_NOT_FOUND, CONFIGURATION_MISSING, CLUSTER_STATE_FAIL } from '.';

describe('CONFIGURATION_MISSING', () => {
    test('should get a string', () => {
        expect(typeof CONFIGURATION_MISSING).toBe('string');
    });
});

describe('CLUSTER_STATE_FAIL', () => {
    test('should get a string', () => {
        expect(typeof CLUSTER_STATE_FAIL).toBe('string');
    });
});

describe(`${CLIENT_NOT_FOUND.name}`, () => {
    test('should get a string that contains a specified string', () => {
        const namespace = 'client0';

        expect(CLIENT_NOT_FOUND(namespace)).toContain(namespace);
        expect(CLIENT_NOT_FOUND(namespace)).toContain('Redis');
        expect(CLIENT_NOT_FOUND(namespace, true)).toContain('Cluster');
    });
});
