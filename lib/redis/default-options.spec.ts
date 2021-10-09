import { defaultRedisModuleOptions } from './default-options';

describe('defaultRedisModuleOptions', () => {
    test('should validate the defaultRedisModuleOptions', () => {
        expect(defaultRedisModuleOptions.closeClient).toBe(false);
        expect(defaultRedisModuleOptions.readyLog).toBe(false);
        expect(defaultRedisModuleOptions.config).toEqual({ host: 'localhost', port: 6379 });
        expect(defaultRedisModuleOptions.commonOptions).toBeUndefined();
    });
});
