import IORedis from 'ioredis';
import {
    createProviders,
    createAsyncProviders,
    createAsyncOptionsProvider,
    redisClientsProvider,
    createRedisClientProviders
} from './redis.providers';
import { RedisOptionsFactory, RedisModuleAsyncOptions, RedisClients, RedisModuleOptions } from './interfaces';
import { REDIS_OPTIONS } from './redis.constants';
import { namespaces } from './common';

const port = 6380;
const password = '1519411258901';

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
    test('if use useFactory or useExisting, should have 2 members in the result array', () => {
        expect(
            createAsyncProviders({
                useFactory: () => ({}),
                inject: []
            })
        ).toHaveLength(2);

        expect(
            createAsyncProviders({
                useExisting: RedisConfigService
            })
        ).toHaveLength(2);
    });

    test('if use useClass, should have 3 members in the result array', () => {
        expect(
            createAsyncProviders({
                useClass: RedisConfigService
            })
        ).toHaveLength(3);
    });

    test('should throw an error when not specify useFactory, useClass and useExisting', () => {
        expect(() => createAsyncProviders({})).toThrow();
    });
});

describe(`${createAsyncOptionsProvider.name}`, () => {
    test('should create async options provider with useFactory', () => {
        const options: RedisModuleAsyncOptions = {
            useFactory: () => ({}),
            inject: ['DIToken']
        };

        expect(createAsyncOptionsProvider(options)).toEqual({ ...options, provide: REDIS_OPTIONS });
    });

    test('should create async options provider with useClass', () => {
        const options: RedisModuleAsyncOptions = {
            useClass: RedisConfigService
        };

        expect(createAsyncOptionsProvider(options)).toHaveProperty('provide', REDIS_OPTIONS);
        expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
        expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [RedisConfigService]);
    });

    test('should create async options provider with useExisting', () => {
        const options: RedisModuleAsyncOptions = {
            useExisting: RedisConfigService
        };

        expect(createAsyncOptionsProvider(options)).toHaveProperty('provide', REDIS_OPTIONS);
        expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
        expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [RedisConfigService]);
    });

    test('should create async options provider without options', () => {
        expect(createAsyncOptionsProvider({})).toEqual({ provide: REDIS_OPTIONS, useValue: {} });
    });
});

describe('redisClientsProvider', () => {
    let clients: RedisClients;

    afterEach(() => {
        [...clients.values()].forEach(client => client.disconnect());
    });

    test('useFactory should create a map with a single client', async () => {
        const options: RedisModuleOptions = {
            config: { port, password }
        };

        clients = redisClientsProvider.useFactory(options);

        expect(clients.size).toBe(1);

        const [clientDefault] = [...clients.values()];

        const resDefault = await clientDefault.ping();
        expect(resDefault).toBe('PONG');
    });

    test('useFactory should create a map with a single client and default options', async () => {
        const options: RedisModuleOptions = {
            defaultOptions: { port, password },
            config: { db: 0 }
        };

        clients = redisClientsProvider.useFactory(options);

        expect(clients.size).toBe(1);

        const [clientDefault] = [...clients.values()];

        const resDefault = await clientDefault.ping();
        expect(resDefault).toBe('PONG');
    });

    test('useFactory should create a map with multiple clients', async () => {
        const options: RedisModuleOptions = {
            config: [
                { port, password, db: 0 },
                { port, password, db: 1, namespace: 'client1' }
            ]
        };

        clients = redisClientsProvider.useFactory(options);

        expect(clients.size).toBe(2);

        const [clientDefault, client1] = [...clients.values()];

        const resDefault = await clientDefault.ping();
        expect(resDefault).toBe('PONG');

        const res1 = await client1.ping();
        expect(res1).toBe('PONG');
    });

    test('useFactory should create a map with multiple clients and default options', async () => {
        const options: RedisModuleOptions = {
            defaultOptions: { port, password },
            config: [{ db: 0 }, { db: 1, namespace: 'client1' }]
        };

        clients = redisClientsProvider.useFactory(options);

        expect(clients.size).toBe(2);

        const [clientDefault, client1] = [...clients.values()];

        const resDefault = await clientDefault.ping();
        expect(resDefault).toBe('PONG');

        const res1 = await client1.ping();
        expect(res1).toBe('PONG');
    });

    test('useFactory should create a map with an empty option', () => {
        clients = redisClientsProvider.useFactory({});

        expect(clients.size).toBe(1);
        [...clients.values()].forEach(client => expect(client).toBeInstanceOf(IORedis));
    });
});

describe(`${createRedisClientProviders.name}`, () => {
    beforeAll(() => {
        namespaces.push(...['client1', Symbol('client2')]);
    });

    test('should create redis client providers', () => {
        expect(createRedisClientProviders()).toHaveLength(2);
        createRedisClientProviders().forEach(item => {
            expect(item).toHaveProperty('provide');
            expect(item).toHaveProperty('useFactory');
            expect(item).toHaveProperty('inject');
        });
    });
});
