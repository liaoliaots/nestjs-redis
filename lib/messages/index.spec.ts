import {
    CLIENT_NOT_FOUND,
    MISSING_CONFIGURATION,
    FAILED_CLUSTER_STATE,
    CANNOT_BE_READ,
    CLIENT_NOT_FOUND_FOR_HEALTH,
    CONNECTED_SUCCESSFULLY
} from '.';

describe('MISSING_CONFIGURATION', () => {
    test('should be a string', () => {
        expect(typeof MISSING_CONFIGURATION).toBe('string');
    });
});

describe('FAILED_CLUSTER_STATE', () => {
    test('should be a string', () => {
        expect(typeof FAILED_CLUSTER_STATE).toBe('string');
    });
});

describe('CANNOT_BE_READ', () => {
    test('should be a string', () => {
        expect(typeof CANNOT_BE_READ).toBe('string');
    });
});

describe('CLIENT_NOT_FOUND_FOR_HEALTH', () => {
    test('should be a string', () => {
        expect(typeof CLIENT_NOT_FOUND_FOR_HEALTH).toBe('string');
    });
});

describe('CONNECTED_SUCCESSFULLY', () => {
    test('should be a string', () => {
        expect(typeof CONNECTED_SUCCESSFULLY).toBe('string');
    });
});

describe('CLIENT_NOT_FOUND', () => {
    test('should return a string', () => {
        const namespace = 'client';
        expect(CLIENT_NOT_FOUND(namespace)).toContain(namespace);
        expect(CLIENT_NOT_FOUND(namespace)).toContain('redis');
        expect(CLIENT_NOT_FOUND(namespace, false)).toContain(namespace);
        expect(CLIENT_NOT_FOUND(namespace, false)).toContain('cluster');
    });
});
