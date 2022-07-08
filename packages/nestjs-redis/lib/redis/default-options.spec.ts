import { defaultRedisModuleOptions } from './default-options';

describe('defaultRedisModuleOptions', () => {
    test('should validate the defaultRedisModuleOptions', () => {
        expect(defaultRedisModuleOptions.closeClient).toBe(true);
        expect(defaultRedisModuleOptions.readyLog).toBe(false);
        expect(defaultRedisModuleOptions.config).toBeUndefined();
        expect(defaultRedisModuleOptions.commonOptions).toBeUndefined();
    });
});
