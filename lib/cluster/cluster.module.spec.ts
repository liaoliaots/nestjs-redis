import { ClusterModule } from './cluster.module';
import { ClusterModuleAsyncOptions } from './interfaces';
import { quitClients } from './common';
import { logger } from './cluster-logger';

jest.mock('./common');
const mockQuitClients = quitClients as jest.MockedFunction<typeof quitClients>;

jest.mock('./cluster-logger', () => ({
    logger: {
        error: jest.fn()
    }
}));

describe('ClusterModule', () => {
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

        test('should work correctly with extraProviders', () => {
            const options: ClusterModuleAsyncOptions = {
                useFactory: () => ({ config: { nodes: [] } }),
                extraProviders: [{ provide: '', useValue: '' }]
            };
            const module = ClusterModule.forRootAsync(options);
            expect(module.providers?.length).toBeGreaterThanOrEqual(4);
        });

        test('should throw an error', () => {
            expect(() => ClusterModule.forRootAsync({})).toThrow();
        });
    });

    describe('onApplicationShutdown', () => {
        beforeEach(() => {
            mockQuitClients.mockReset();
            jest.spyOn(logger, 'error').mockReset();
        });

        test('should call quitClients', async () => {
            mockQuitClients.mockResolvedValue([]);

            const module = new ClusterModule({ closeClient: true, config: { nodes: [] } }, new Map());
            await module.onApplicationShutdown();
            expect(mockQuitClients).toHaveBeenCalledTimes(1);
        });

        test('should not call quitClients', async () => {
            mockQuitClients.mockResolvedValue([]);

            const module = new ClusterModule({ closeClient: false, config: { nodes: [] } }, new Map());
            await module.onApplicationShutdown();
            expect(mockQuitClients).toHaveBeenCalledTimes(0);
        });

        test('should call logger.error', async () => {
            const mockError = jest.spyOn(logger, 'error');
            mockQuitClients.mockResolvedValue([
                [
                    { status: 'fulfilled', value: '' },
                    { status: 'rejected', reason: new Error('') }
                ]
            ]);

            const module = new ClusterModule({ closeClient: true, config: { nodes: [] } }, new Map());
            await module.onApplicationShutdown();
            expect(mockError).toHaveBeenCalledTimes(1);
        });

        test('should not call logger.error', async () => {
            const mockError = jest.spyOn(logger, 'error');
            mockQuitClients.mockResolvedValue([
                [
                    { status: 'fulfilled', value: '' },
                    { status: 'fulfilled', value: 'OK' }
                ]
            ]);

            const module = new ClusterModule({ closeClient: true, config: { nodes: [] } }, new Map());
            await module.onApplicationShutdown();
            expect(mockError).toHaveBeenCalledTimes(0);
        });
    });
});
