import { ClientNotFoundError } from './client-not-found.error';

describe('ClientNotFoundError', () => {
  test('should create an instance for redis', () => {
    const error = new ClientNotFoundError('name', 'redis');
    expect(error.name).toBe(ClientNotFoundError.name);
    expect(error.message).toContain('name');
    expect(error.message).toContain('redis');
    expect(error.stack).toBeDefined();
  });

  test('should create an instance for cluster', () => {
    const error = new ClientNotFoundError('name', 'cluster');
    expect(error.name).toBe(ClientNotFoundError.name);
    expect(error.message).toContain('name');
    expect(error.message).toContain('cluster');
    expect(error.stack).toBeDefined();
  });
});
