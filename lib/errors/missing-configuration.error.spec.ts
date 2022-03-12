import { MissingConfigurationError } from './missing-configuration.error';

describe('MissingConfigurationError', () => {
    test('should create an instance', () => {
        const error = new MissingConfigurationError('custom');
        expect(error.name).toBe(MissingConfigurationError.name);
        expect(error.message).toBe('custom');
        expect(error.stack).toBeDefined();
    });
});
