import { ClusterModule } from './cluster.module';
import { ClusterModuleAsyncOptions, ClusterModuleOptions } from './interfaces';

const clusterModuleOptions: ClusterModuleOptions = { config: { startupNodes: [] } };

describe(`${ClusterModule.forRoot.name}`, () => {
    test('should register the module with options', () => {
        expect(ClusterModule.forRoot(clusterModuleOptions).module).toBe(ClusterModule);
        expect(ClusterModule.forRoot(clusterModuleOptions).imports).toHaveLength(1);
    });
});

describe(`${ClusterModule.forRootAsync.name}`, () => {
    const options: ClusterModuleAsyncOptions = { imports: [], useFactory: () => clusterModuleOptions, inject: [] };

    test('should register the async module with async options', () => {
        expect(ClusterModule.forRootAsync(options).module).toBe(ClusterModule);
        expect(ClusterModule.forRootAsync(options).imports).toHaveLength(1);
    });
});
