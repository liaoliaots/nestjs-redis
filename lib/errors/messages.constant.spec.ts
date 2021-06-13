import { CLIENT_NOT_FOUND, TIMEOUT_EXCEEDED, CONFIGURATION_MISSING } from '.';

describe(`${CLIENT_NOT_FOUND.name}`, () => {
    test('should get a string that contains a specified string', () => {
        const namespaceInString = 'client1';
        const namespaceInSymbol = Symbol('client2');

        expect(CLIENT_NOT_FOUND(namespaceInString)).toContain(namespaceInString);
        expect(CLIENT_NOT_FOUND(namespaceInSymbol)).toContain(namespaceInSymbol.toString());
    });
});

describe(`${TIMEOUT_EXCEEDED.name}`, () => {
    test('should get a string that contains a specified string', () => {
        const timeout = 1000;

        expect(TIMEOUT_EXCEEDED(timeout)).toContain(String(timeout));
    });
});

describe('CONFIGURATION_MISSING', () => {
    test('should get a string', () => {
        expect(typeof CONFIGURATION_MISSING).toBe('string');
    });
});
