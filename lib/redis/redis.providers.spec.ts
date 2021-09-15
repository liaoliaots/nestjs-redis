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
import { REDIS_OPTIONS, REDIS_CLIENTS, DEFAULT_REDIS_NAMESPACE } from './redis.constants';
import { namespaces, displayReadyLog } from './common';
import { RedisService } from './redis.service';

jest.mock('ioredis');
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
            useValue: {}
        });
    });
});

describe('createAsyncProviders', () => {
    test('should work correctly', () => {
        expect(createAsyncProviders({ useFactory: () => ({}), inject: [] })).toHaveLength(1);
        expect(createAsyncProviders({ useClass: RedisConfigService })).toHaveLength(2);
        expect(createAsyncProviders({ useExisting: RedisConfigService })).toHaveLength(1);
        expect(createAsyncProviders({})).toHaveLength(0);
    });
});

describe('createAsyncOptions', () => {
    test('should work correctly', async () => {
        const redisConfigService: RedisOptionsFactory = {
            createRedisOptions() {
                return { closeClient: true };
            }
        };
        await expect(createAsyncOptions(redisConfigService)).resolves.toEqual({ closeClient: true });
    });
});

describe('createAsyncOptionsProvider', () => {
    test('should create provider with useFactory', () => {
        const options: RedisModuleAsyncOptions = { useFactory: () => ({}), inject: ['token'] };
        expect(createAsyncOptionsProvider(options)).toEqual({ provide: REDIS_OPTIONS, ...options });
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
        let service: RedisService;

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
                providers: [{ provide: REDIS_OPTIONS, useValue: options }, redisClientsProvider, RedisService]
            }).compile();

            clients = module.get<RedisClients>(REDIS_CLIENTS);
            service = module.get<RedisService>(RedisService);
        });

        test('should have 2 members', () => {
            expect(clients.size).toBe(2);
        });

        test('should work correctly', () => {
            let client: Redis;
            client = service.getClient(DEFAULT_REDIS_NAMESPACE);
            expect(client).toBeInstanceOf(IORedis);
            client = service.getClient('client1');
            expect(client).toBeInstanceOf(IORedis);
        });
    });

    describe('with a single client and no namespace', () => {
        let clients: RedisClients;
        let service: RedisService;

        beforeEach(async () => {
            const options: RedisModuleOptions = {
                config: {
                    host: '127.0.0.1',
                    port: 6380
                }
            };

            const module: TestingModule = await Test.createTestingModule({
                providers: [{ provide: REDIS_OPTIONS, useValue: options }, redisClientsProvider, RedisService]
            }).compile();

            clients = module.get<RedisClients>(REDIS_CLIENTS);
            service = module.get<RedisService>(RedisService);
        });

        test('should have 1 member', () => {
            expect(clients.size).toBe(1);
        });

        test('should work correctly', () => {
            const client = service.getClient(DEFAULT_REDIS_NAMESPACE);
            expect(client).toBeInstanceOf(IORedis);
        });
    });

    describe('with a single client and namespace', () => {
        let clients: RedisClients;
        let service: RedisService;

        beforeEach(async () => {
            const options: RedisModuleOptions = {
                config: {
                    namespace: 'client1',
                    host: '127.0.0.1',
                    port: 6380
                }
            };

            const module: TestingModule = await Test.createTestingModule({
                providers: [{ provide: REDIS_OPTIONS, useValue: options }, redisClientsProvider, RedisService]
            }).compile();

            clients = module.get<RedisClients>(REDIS_CLIENTS);
            service = module.get<RedisService>(RedisService);
        });

        test('should have 1 member', () => {
            expect(clients.size).toBe(1);
        });

        test('should work correctly', () => {
            const client = service.getClient('client1');
            expect(client).toBeInstanceOf(IORedis);
        });
    });

    describe('without options', () => {
        let clients: RedisClients;
        let service: RedisService;

        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [{ provide: REDIS_OPTIONS, useValue: {} }, redisClientsProvider, RedisService]
            }).compile();

            clients = module.get<RedisClients>(REDIS_CLIENTS);
            service = module.get<RedisService>(RedisService);
        });

        test('should have 1 member', () => {
            expect(clients.size).toBe(1);
        });

        test('should work correctly', () => {
            const client = service.getClient(DEFAULT_REDIS_NAMESPACE);
            expect(client).toBeInstanceOf(IORedis);
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
            providers: [{ provide: REDIS_CLIENTS, useValue: clients }, RedisService, ...createRedisClientProviders()]
        }).compile();

        client1 = module.get<Redis>('client1');
        client2 = module.get<Redis>('client2');
    });

    test('should work correctly', () => {
        expect(client1).toBeInstanceOf(IORedis);
        expect(client2).toBeInstanceOf(IORedis);
    });
});
