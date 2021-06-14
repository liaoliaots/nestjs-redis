import { CLIENT_NOT_FOUND, TIMEOUT_EXCEEDED, CONFIGURATION_MISSING } from '.';

describe('CONFIGURATION_MISSING', () => {
    test('should get a string', () => {
        expect(typeof CONFIGURATION_MISSING).toBe('string');
    });
});

describe(`${CLIENT_NOT_FOUND.name}`, () => {
    test('should get a string that contains a specified string', () => {
        const namespace = 'client0';

        expect(CLIENT_NOT_FOUND(namespace)).toContain(namespace);
    });
});

describe(`${TIMEOUT_EXCEEDED.name}`, () => {
    test('should get a string that contains a specified string', () => {
        const timeout = 1000;

        expect(TIMEOUT_EXCEEDED(timeout)).toContain(String(timeout));
    });
});
