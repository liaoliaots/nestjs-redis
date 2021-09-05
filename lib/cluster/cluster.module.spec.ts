import { ClusterModule } from './cluster.module';
import { ClusterModuleAsyncOptions } from './interfaces';

describe('ClusterModule', () => {
    describe('forRoot', () => {
        test('should work correctly', () => {
            const module = ClusterModule.forRoot({ config: { nodes: [] } });
            expect(module.module).toBe(ClusterModule);
            expect(module.imports?.length).toBe(1);
        });
    });

    describe('forRootAsync', () => {
        test('should work correctly', () => {
            const options: ClusterModuleAsyncOptions = { useFactory: () => ({ config: { nodes: [] } }), inject: [] };
            const module = ClusterModule.forRootAsync(options);
            expect(module.module).toBe(ClusterModule);
            expect(module.imports?.length).toBe(1);
        });
    });
});
