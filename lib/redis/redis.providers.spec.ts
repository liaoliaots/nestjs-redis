import { FactoryProvider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import IORedis, { Redis } from 'ioredis';
import {
    createOptionsProvider,
    createAsyncProviders,
    createAsyncOptionsProvider,
    redisClientsProvider,
    createRedisClientProviders,
    createAsyncOptions
} from './redis.providers';
import { RedisOptionsFactory, RedisModuleAsyncOptions, RedisClients, RedisModuleOptions } from './interfaces';
import { REDIS_OPTIONS, REDIS_CLIENTS, DEFAULT_REDIS_NAMESPACE, REDIS_INTERNAL_OPTIONS } from './redis.constants';
import { namespaces, displayReadyLog } from './common';
import { RedisManager } from './redis-manager';
import { defaultRedisModuleOptions } from './default-options';

jest.mock('./common', () => ({
    __esModule: true,
    ...jest.requireActual('./common'),
    displayReadyLog: jest.fn()
}));

class RedisConfigService implements RedisOptionsFactory {
    createRedisOptions(): RedisModuleOptions {
        return {};
    }
}

describe('createOptionsProvider', () => {
    test('should work correctly', () => {
        expect(createOptionsProvider({})).toEqual({
            provide: REDIS_OPTIONS,
            useValue: { ...defaultRedisModuleOptions }
        });
    });
});

describe('createAsyncProviders', () => {
    test('should create providers with useFactory', () => {
        const result = createAsyncProviders({ useFactory: () => ({}), inject: [] });
        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('provide', REDIS_OPTIONS);
        expect(result[0]).toHaveProperty('inject', [REDIS_INTERNAL_OPTIONS]);
        expect((result[0] as FactoryProvider).useFactory({ closeClient: true })).toEqual({
            ...defaultRedisModuleOptions,
            closeClient: true
        });
        expect(result[1]).toHaveProperty('provide', REDIS_INTERNAL_OPTIONS);
        expect(result[1]).toHaveProperty('inject', []);
    });

    test('should create providers with useClass', () => {
        const result = createAsyncProviders({ useClass: RedisConfigService });
        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('provide', RedisConfigService);
        expect(result[0]).toHaveProperty('useClass', RedisConfigService);
        expect(result[1]).toHaveProperty('provide', REDIS_OPTIONS);
        expect(result[1]).toHaveProperty('inject', [RedisConfigService]);
    });

    test('should create providers with useExisting', () => {
        const result = createAsyncProviders({ useExisting: RedisConfigService });
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('provide', REDIS_OPTIONS);
        expect(result[0]).toHaveProperty('inject', [RedisConfigService]);
    });

    test('should create providers without options', () => {
        const result = createAsyncProviders({});
        expect(result).toHaveLength(0);
    });
});

describe('createAsyncOptions', () => {
    test('should work correctly', async () => {
        const redisConfigService: RedisOptionsFactory = {
            createRedisOptions() {
                return { closeClient: true };
            }
        };
        await expect(createAsyncOptions(redisConfigService)).resolves.toEqual({
            ...defaultRedisModuleOptions,
            closeClient: true
        });
    });
});

describe('createAsyncOptionsProvider', () => {
    test('should create provider with useFactory', () => {
        const options: RedisModuleAsyncOptions = { useFactory: () => ({}), inject: ['token'] };
        expect(createAsyncOptionsProvider(options)).toEqual({ provide: REDIS_INTERNAL_OPTIONS, ...options });
    });

    test('should create provider with useClass', () => {
        const options: RedisModuleAsyncOptions = { useClass: RedisConfigService };
        expect(createAsyncOptionsProvider(options)).toHaveProperty('provide', REDIS_OPTIONS);
        expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
        expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [RedisConfigService]);
    });

    test('should create provider with useExisting', () => {
        const options: RedisModuleAsyncOptions = { useExisting: RedisConfigService };
        expect(createAsyncOptionsProvider(options)).toHaveProperty('provide', REDIS_OPTIONS);
        expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
        expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [RedisConfigService]);
    });

    test('should create provider without options', () => {
        expect(createAsyncOptionsProvider({})).toEqual({ provide: REDIS_OPTIONS, useValue: {} });
    });
});

describe('redisClientsProvider', () => {
    describe('with multiple clients', () => {
        let clients: RedisClients;
        let manager: RedisManager;

        beforeEach(async () => {
            const options: RedisModuleOptions = {
                config: [
                    {
                        host: '127.0.0.1',
                        port: 6380
                    },
                    {
                        namespace: 'client1',
                        host: '127.0.0.1',
                        port: 6381
                    }
                ]
            };

            const module: TestingModule = await Test.createTestingModule({
                providers: [{ provide: REDIS_OPTIONS, useValue: options }, redisClientsProvider, RedisManager]
            }).compile();

            clients = module.get<RedisClients>(REDIS_CLIENTS);
            manager = module.get<RedisManager>(RedisManager);
        });

        test('should have 2 members', () => {
            expect(clients.size).toBe(2);
        });

        test('should work correctly', () => {
            let client: Redis;
            client = manager.getClient(DEFAULT_REDIS_NAMESPACE);
            expect(client).toBeInstanceOf(IORedis);
            client = manager.getClient('client1');
            expect(client).toBeInstanceOf(IORedis);
        });
    });

    describe('with a single client and no namespace', () => {
        let clients: RedisClients;
        let manager: RedisManager;

        beforeEach(async () => {
            const options: RedisModuleOptions = {
                config: {
                    host: '127.0.0.1',
                    port: 6380
                }
            };

            const module: TestingModule = await Test.createTestingModule({
                providers: [{ provide: REDIS_OPTIONS, useValue: options }, redisClientsProvider, RedisManager]
            }).compile();

            clients = module.get<RedisClients>(REDIS_CLIENTS);
            manager = module.get<RedisManager>(RedisManager);
        });

        test('should have 1 member', () => {
            expect(clients.size).toBe(1);
        });

        test('should work correctly', () => {
            const client = manager.getClient(DEFAULT_REDIS_NAMESPACE);
            expect(client).toBeInstanceOf(IORedis);
        });
    });

    describe('with a single client and namespace', () => {
        let clients: RedisClients;
        let manager: RedisManager;

        beforeEach(async () => {
            const options: RedisModuleOptions = {
                config: {
                    namespace: 'client1',
                    host: '127.0.0.1',
                    port: 6380
                }
            };

            const module: TestingModule = await Test.createTestingModule({
                providers: [{ provide: REDIS_OPTIONS, useValue: options }, redisClientsProvider, RedisManager]
            }).compile();

            clients = module.get<RedisClients>(REDIS_CLIENTS);
            manager = module.get<RedisManager>(RedisManager);
        });

        test('should have 1 member', () => {
            expect(clients.size).toBe(1);
        });

        test('should work correctly', () => {
            const client = manager.getClient('client1');
            expect(client).toBeInstanceOf(IORedis);
        });
    });

    describe('without options', () => {
        let clients: RedisClients;

        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [{ provide: REDIS_OPTIONS, useValue: {} }, redisClientsProvider, RedisManager]
            }).compile();

            clients = module.get<RedisClients>(REDIS_CLIENTS);
        });

        test('should have 1 member', () => {
            expect(clients.size).toBe(0);
        });
    });

    describe('displayReadyLog', () => {
        beforeEach(() => {
            (displayReadyLog as jest.MockedFunction<typeof displayReadyLog>).mockReset();
        });

        test('multiple clients', () => {
            const options: RedisModuleOptions = {
                readyLog: true,
                config: [
                    {
                        host: '127.0.0.1',
                        port: 6380
                    },
                    {
                        namespace: 'client1',
                        host: '127.0.0.1',
                        port: 6381
                    }
                ]
            };
            redisClientsProvider.useFactory(options);
            expect(displayReadyLog).toHaveBeenCalledTimes(1);
        });

        test('single client', () => {
            const options: RedisModuleOptions = {
                readyLog: true,
                config: {
                    host: '127.0.0.1',
                    port: 6380
                }
            };
            redisClientsProvider.useFactory(options);
            expect(displayReadyLog).toHaveBeenCalledTimes(1);
        });

        test('without options', () => {
            redisClientsProvider.useFactory({ readyLog: true });
            expect(displayReadyLog).toHaveBeenCalledTimes(1);
        });
    });
});

describe('createRedisClientProviders', () => {
    let clients: RedisClients;
    let client1: Redis;
    let client2: Redis;

    beforeEach(async () => {
        clients = new Map();
        clients.set('client1', new IORedis());
        clients.set('client2', new IORedis());
        namespaces.set('client1', 'client1');
        namespaces.set('client2', 'client2');

        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: REDIS_CLIENTS, useValue: clients }, RedisManager, ...createRedisClientProviders()]
        }).compile();

        client1 = module.get<Redis>('client1');
        client2 = module.get<Redis>('client2');
    });

    test('should work correctly', () => {
        expect(client1).toBeInstanceOf(IORedis);
        expect(client2).toBeInstanceOf(IORedis);
    });
});
