import { CLIENT_NOT_FOUND, MISSING_CONFIGURATION, FAILED_CLUSTER_STATE, MISSING_REQUIRED_DEPENDENCY } from '.';

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
        expect(CLIENT_NOT_FOUND(namespace)).toContain('Redis');
        expect(CLIENT_NOT_FOUND(namespace, true)).toContain('Cluster');
    });
});

describe(`${MISSING_REQUIRED_DEPENDENCY.name}`, () => {
    test('should get a string that contains a specified string', () => {
        expect(MISSING_REQUIRED_DEPENDENCY(['ioredis'])).toContain(
            'The "ioredis" package is missing. Please, make sure to install the library ($ npm install --save ioredis)'
        );
        expect(MISSING_REQUIRED_DEPENDENCY(['ioredis', '@nestjs/terminus'])).toContain(
            'The "ioredis", "@nestjs/terminus" packages are missing. Please, make sure to install the libraries ($ npm install --save ioredis @nestjs/terminus)'
        );
    });
});
