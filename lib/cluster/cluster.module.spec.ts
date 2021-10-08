import { ClusterModule } from './cluster.module';
import { ClusterModuleAsyncOptions } from './interfaces';
import { quitClients } from './common';

jest.mock('./common');
const mockQuitClients = quitClients as jest.MockedFunction<typeof quitClients>;

beforeEach(() => {
    mockQuitClients.mockReset();
});

describe('ClusterCoreModule', () => {
    describe('forRoot', () => {
        test('should work correctly', () => {
            const module = ClusterModule.forRoot({ config: { nodes: [] } });
            expect(module.module).toBe(ClusterModule);
            expect(module.providers?.length).toBeGreaterThanOrEqual(3);
            expect(module.exports?.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('forRootAsync', () => {
        test('should work correctly', () => {
            const options: ClusterModuleAsyncOptions = {
                imports: [],
                useFactory: () => ({ config: { nodes: [] } }),
                inject: []
            };
            const module = ClusterModule.forRootAsync(options);
            expect(module.module).toBe(ClusterModule);
            expect(module.imports?.length).toBe(0);
            expect(module.providers?.length).toBeGreaterThanOrEqual(3);
            expect(module.exports?.length).toBeGreaterThanOrEqual(1);
        });

        test('should throw an error', () => {
            expect(() => ClusterModule.forRootAsync({})).toThrow();
        });
    });

    describe('onApplicationShutdown', () => {
        test('should call quitClients', () => {
            const module = new ClusterModule({ closeClient: true, config: { nodes: [] } }, new Map());
            module.onApplicationShutdown();
            expect(mockQuitClients).toHaveBeenCalledTimes(1);
        });

        test('should not call quitClients', () => {
            const module = new ClusterModule({ closeClient: false, config: { nodes: [] } }, new Map());
            module.onApplicationShutdown();
            expect(mockQuitClients).toHaveBeenCalledTimes(0);
        });
    });
});
