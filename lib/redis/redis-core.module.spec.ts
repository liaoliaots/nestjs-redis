import IORedis from 'ioredis';
import { RedisCoreModule } from './redis-core.module';
import { RedisModuleAsyncOptions, RedisModuleOptions, RedisClients } from './interfaces';
import { testConfig } from '../../test/env';

describe('RedisCoreModule', () => {
    describe('forRoot', () => {
        test('should register the module with options', () => {
            const options: RedisModuleOptions = {};
            expect(RedisCoreModule.forRoot(options).module).toBe(RedisCoreModule);
            expect(RedisCoreModule.forRoot(options).providers?.length).toBeGreaterThanOrEqual(3);
            expect(RedisCoreModule.forRoot(options).exports?.length).toBeGreaterThanOrEqual(1);
        });

        test('should register the module without options', () => {
            expect(RedisCoreModule.forRoot().module).toBe(RedisCoreModule);
            expect(RedisCoreModule.forRoot().providers?.length).toBeGreaterThanOrEqual(3);
            expect(RedisCoreModule.forRoot().exports?.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('forRootAsync', () => {
        const options: RedisModuleAsyncOptions = { imports: [], useFactory: () => ({}), inject: [] };
        test('should register the async module with async options', () => {
            expect(RedisCoreModule.forRootAsync(options).module).toBe(RedisCoreModule);
            expect(RedisCoreModule.forRootAsync(options).imports).toHaveLength(0);
            expect(RedisCoreModule.forRootAsync(options).providers?.length).toBeGreaterThanOrEqual(3);
            expect(RedisCoreModule.forRootAsync(options).exports?.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('instantiate', () => {
        const clients: RedisClients = new Map();
        const options: RedisModuleOptions = { closeClient: true, config: { ...testConfig.master } };

        const timeout = () =>
            new Promise<void>(resolve => {
                const id = setTimeout(() => {
                    clearTimeout(id);
                    resolve();
                }, 50);
            });

        beforeEach(async () => {
            clients.set('client0', new IORedis(testConfig.master));
            clients.set('client1', new IORedis(testConfig.master));

            await timeout();
        });

        afterAll(() => {
            clients.forEach(client => void client.quit());
        });

        test('when the status is ready', async () => {
            const module = new RedisCoreModule(options, clients);
            clients.forEach(client => expect(client.status).toBe('ready'));
            await module.onApplicationShutdown();

            await timeout();
            clients.forEach(client => expect(client.status).toBe('end'));
        });

        test('when closeClient is false', async () => {
            const module = new RedisCoreModule({ ...options, closeClient: false }, clients);
            clients.forEach(client => expect(client.status).toBe('ready'));
            await module.onApplicationShutdown();

            await timeout();
            clients.forEach(client => expect(client.status).toBe('ready'));
        });
    });
});
