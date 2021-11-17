import { RedisModule } from './redis.module';
import { RedisModuleAsyncOptions } from './interfaces';
import { quitClients } from './common';
import { logger } from './redis-logger';

jest.mock('./common');
const mockQuitClients = quitClients as jest.MockedFunction<typeof quitClients>;

jest.mock('./redis-logger', () => ({
    logger: {
        error: jest.fn()
    }
}));

describe('RedisModule', () => {
    describe('forRoot', () => {
        test('should work correctly', () => {
            const module = RedisModule.forRoot();
            expect(module.module).toBe(RedisModule);
            expect(module.providers?.length).toBeGreaterThanOrEqual(3);
            expect(module.exports?.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('forRootAsync', () => {
        test('should work correctly', () => {
            const options: RedisModuleAsyncOptions = {
                imports: [],
                useFactory: () => ({}),
                inject: []
            };
            const module = RedisModule.forRootAsync(options);
            expect(module.module).toBe(RedisModule);
            expect(module.imports?.length).toBe(0);
            expect(module.providers?.length).toBeGreaterThanOrEqual(3);
            expect(module.exports?.length).toBeGreaterThanOrEqual(1);
        });

        test('should work correctly with extraProviders', () => {
            const options: RedisModuleAsyncOptions = {
                useFactory: () => ({}),
                extraProviders: [{ provide: '', useValue: '' }]
            };
            const module = RedisModule.forRootAsync(options);
            expect(module.providers?.length).toBeGreaterThanOrEqual(4);
        });

        test('should throw an error', () => {
            expect(() => RedisModule.forRootAsync({})).toThrow();
        });
    });

    describe('onApplicationShutdown', () => {
        beforeEach(() => {
            mockQuitClients.mockReset();
            jest.spyOn(logger, 'error').mockReset();
        });

        test('should call quitClients', async () => {
            mockQuitClients.mockResolvedValue([]);

            const module = new RedisModule({ closeClient: true }, new Map());
            await module.onApplicationShutdown();
            expect(mockQuitClients).toHaveBeenCalledTimes(1);
        });

        test('should not call quitClients', async () => {
            mockQuitClients.mockResolvedValue([]);

            const module = new RedisModule({ closeClient: false }, new Map());
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

            const module = new RedisModule({ closeClient: true }, new Map());
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

            const module = new RedisModule({ closeClient: true }, new Map());
            await module.onApplicationShutdown();
            expect(mockError).toHaveBeenCalledTimes(0);
        });
    });
});
