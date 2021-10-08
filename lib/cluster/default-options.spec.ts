import { defaultClusterModuleOptions } from './default-options';

describe('defaultClusterModuleOptions', () => {
    test('should validate the defaultClusterModuleOptions', () => {
        expect(defaultClusterModuleOptions.closeClient).toBe(false);
        expect(defaultClusterModuleOptions.readyLog).toBe(false);
        expect(defaultClusterModuleOptions.config).toBeUndefined();
    });
});
