import { Test } from '@nestjs/testing';
import IORedis, { Redis } from 'ioredis';
import {
    createProviders,
    createAsyncProviders,
    createAsyncOptionsProvider,
    redisClientsProvider,
    createRedisClientProviders
} from './redis.providers';
import { RedisOptionsFactory, RedisModuleAsyncOptions, RedisClients, RedisModuleOptions } from './interfaces';
import { REDIS_OPTIONS, REDIS_CLIENTS, DEFAULT_REDIS_CLIENT } from './redis.constants';
import { namespaces, quitClients } from './common';
import { RedisService } from './redis.service';
import { testConfig } from '../../jest-env';

class RedisConfigService implements RedisOptionsFactory {
    createRedisOptions() {
        return {};
    }
}

describe(`${createProviders.name}`, () => {
    test('should have 2 members in the result array', () => {
        expect(createProviders({})).toHaveLength(2);
    });
});

describe(`${createAsyncProviders.name}`, () => {
    test('if provide useFactory or useExisting, the result array should have 2 members', () => {
        expect(createAsyncProviders({ useFactory: () => ({}), inject: [] })).toHaveLength(2);
        expect(createAsyncProviders({ useExisting: RedisConfigService })).toHaveLength(2);
    });

    test('if provide useClass, the result array should have 3 members', () => {
        expect(createAsyncProviders({ useClass: RedisConfigService })).toHaveLength(3);
    });

    test('should throw an error without options', () => {
        expect(() => createAsyncProviders({})).toThrow();
    });
});

describe(`${createAsyncOptionsProvider.name}`, () => {
    test('should create provider with useFactory', () => {
        const options: RedisModuleAsyncOptions = { useFactory: () => ({}), inject: ['DIToken'] };

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

        let redisService: RedisService;

        afterAll(() => {
            quitClients(clients);
        });

        beforeAll(async () => {
            const options: RedisModuleOptions = {
                defaultOptions: {
                    port: testConfig.master.port
                },
                config: [
                    {
                        host: testConfig.master.host,
                        password: testConfig.master.password,
                        namespace: 'client0',
                        db: 0
                    },
                    {
                        host: testConfig.master.host,
                        password: testConfig.master.password,
                        db: 1
                    }
                ]
            };

            const moduleRef = await Test.createTestingModule({
                providers: [{ provide: REDIS_OPTIONS, useValue: options }, redisClientsProvider, RedisService]
            }).compile();

            clients = moduleRef.get<RedisClients>(REDIS_CLIENTS);
            redisService = moduleRef.get<RedisService>(RedisService);
        });

        test('should have 2 members', () => {
            expect(clients.size).toBe(2);
        });

        test('should get a client with namespace', async () => {
            const client = redisService.getClient('client0');

            const res = await client.ping();

            expect(res).toBe('PONG');
        });

        test('should get default client with namespace', async () => {
            const client = redisService.getClient(DEFAULT_REDIS_CLIENT);

            const res = await client.ping();

            expect(res).toBe('PONG');
        });
    });

    describe('with single client', () => {
        let clients: RedisClients;

        let redisService: RedisService;

        afterAll(() => {
            quitClients(clients);
        });

        beforeAll(async () => {
            const options: RedisModuleOptions = {
                config: {
                    host: testConfig.master.host,
                    port: testConfig.master.port,
                    password: testConfig.master.password,
                    db: 1
                }
            };

            const moduleRef = await Test.createTestingModule({
                providers: [{ provide: REDIS_OPTIONS, useValue: options }, redisClientsProvider, RedisService]
            }).compile();

            clients = moduleRef.get<RedisClients>(REDIS_CLIENTS);
            redisService = moduleRef.get<RedisService>(RedisService);
        });

        test('should have 1 member', () => {
            expect(clients.size).toBe(1);
        });

        test('should get default client with namespace', async () => {
            const client = redisService.getClient(DEFAULT_REDIS_CLIENT);

            const res = await client.ping();

            expect(res).toBe('PONG');
        });
    });

    describe('without options', () => {
        let clients: RedisClients;

        let redisService: RedisService;

        afterAll(() => {
            quitClients(clients);
        });

        beforeAll(async () => {
            const moduleRef = await Test.createTestingModule({
                providers: [{ provide: REDIS_OPTIONS, useValue: {} }, redisClientsProvider, RedisService]
            }).compile();

            clients = moduleRef.get<RedisClients>(REDIS_CLIENTS);
            redisService = moduleRef.get<RedisService>(RedisService);
        });

        test('should have 1 member', () => {
            expect(clients.size).toBe(1);
        });

        test('should get default client with namespace', () => {
            const client = redisService.getClient(DEFAULT_REDIS_CLIENT);

            expect(client).toBeInstanceOf(IORedis);
        });
    });
});

describe(`${createRedisClientProviders.name}`, () => {
    const clients: RedisClients = new Map();

    let client0: Redis;
    let client1: Redis;

    afterAll(() => {
        quitClients(clients);
    });

    beforeAll(async () => {
        namespaces.push(...['client0', 'client1']);

        clients.set('client0', new IORedis({ ...testConfig.master, db: 0 }));
        clients.set('client1', new IORedis({ ...testConfig.master, db: 1 }));

        const moduleRef = await Test.createTestingModule({
            providers: [{ provide: REDIS_CLIENTS, useValue: clients }, RedisService, ...createRedisClientProviders()]
        }).compile();

        client0 = moduleRef.get<Redis>('client0');
        client1 = moduleRef.get<Redis>('client1');
    });

    test('client0 should work correctly', async () => {
        const res = await client0.ping();

        expect(res).toBe('PONG');
    });

    test('client1 should work correctly', async () => {
        const res = await client1.ping();

        expect(res).toBe('PONG');
    });
});
