import { RedisCoreModule } from './redis-core.module';
import { RedisModuleAsyncOptions } from './interfaces';
import { quitClients } from './common';

jest.mock('./common');
const mockQuitClients = quitClients as jest.MockedFunction<typeof quitClients>;

beforeEach(() => {
    mockQuitClients.mockReset();
});

describe('RedisCoreModule', () => {
    describe('forRoot', () => {
        test('should work correctly', () => {
            const module = RedisCoreModule.forRoot();
            expect(module.module).toBe(RedisCoreModule);
            expect(module.providers?.length).toBeGreaterThanOrEqual(3);
            expect(module.exports?.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('forRootAsync', () => {
        test('should work correctly', () => {
            const options: RedisModuleAsyncOptions = { imports: [], useFactory: () => ({}), inject: [] };
            const module = RedisCoreModule.forRootAsync(options);
            expect(module.module).toBe(RedisCoreModule);
            expect(module.imports?.length).toBe(0);
            expect(module.providers?.length).toBeGreaterThanOrEqual(3);
            expect(module.exports?.length).toBeGreaterThanOrEqual(1);
        });

        test('should throw an error', () => {
            expect(() => RedisCoreModule.forRootAsync()).toThrow();
        });
    });

    describe('onApplicationShutdown', () => {
        test('should call quitClients', () => {
            const module = new RedisCoreModule({ closeClient: true }, new Map());
            module.onApplicationShutdown();
            expect(mockQuitClients).toHaveBeenCalledTimes(1);
        });

        test('should not call quitClients', () => {
            const module = new RedisCoreModule({ closeClient: false }, new Map());
            module.onApplicationShutdown();
            expect(mockQuitClients).toHaveBeenCalledTimes(0);
        });
    });
});
