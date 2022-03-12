import { ClientNotFoundError } from './client-not-found.error';

describe('ClientNotFoundError', () => {
    test('should create an instance', () => {
        const error = new ClientNotFoundError('custom');
        expect(error.name).toBe(ClientNotFoundError.name);
        expect(error.message).toBe('custom');
        expect(error.stack).toBeDefined();
    });
});
