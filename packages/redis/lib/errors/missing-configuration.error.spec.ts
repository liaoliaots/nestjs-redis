import { MissingConfigurationsError } from './missing-configurations.error';

describe('MissingConfigurationsError', () => {
  test('should create an instance', () => {
    const error = new MissingConfigurationsError();
    expect(error.name).toBe(MissingConfigurationsError.name);
    expect(typeof error.message).toBe('string');
    expect(error.stack).toBeDefined();
  });
});
