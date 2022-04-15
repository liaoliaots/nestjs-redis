import { FactoryProvider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';
import {
    createOptionsProvider,
    createAsyncProviders,
    createAsyncOptionsProvider,
    redisClientsProvider,
    createRedisClientProviders,
    createAsyncOptions
} from './redis.providers';
import { RedisOptionsFactory, RedisModuleAsyncOptions, RedisClients, RedisModuleOptions } from './interfaces';
import { REDIS_OPTIONS, REDIS_CLIENTS, REDIS_INTERNAL_OPTIONS } from './redis.constants';
import { namespaces, displayReadyLog, displayErrorLog } from './common';
import { RedisManager } from './redis-manager';
import { defaultRedisModuleOptions } from './default-options';

jest.mock('ioredis', () => jest.fn(() => ({})));

jest.mock('./common', () => ({
    ...jest.requireActual('./common'),
    displayReadyLog: jest.fn(),
    displayErrorLog: jest.fn()
}));
const mockDisplayReadyLog = displayReadyLog as jest.MockedFunction<typeof displayReadyLog>;
const mockDisplayErrorLog = displayErrorLog as jest.MockedFunction<typeof displayErrorLog>;

beforeEach(() => {
    mockDisplayReadyLog.mockReset();
    mockDisplayErrorLog.mockReset();
});

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
    test('should be a dynamic module', () => {
        expect(redisClientsProvider).toHaveProperty('provide', REDIS_CLIENTS);
        expect(redisClientsProvider).toHaveProperty('useFactory');
        expect(redisClientsProvider).toHaveProperty('inject', [REDIS_OPTIONS]);
    });

    test('with multiple clients', () => {
        const options: RedisModuleOptions = { readyLog: true, errorLog: true, config: [{}, { namespace: 'client1' }] };
        const clients = redisClientsProvider.useFactory(options);
        expect(clients.size).toBe(2);
        expect(mockDisplayErrorLog).toHaveBeenCalledTimes(1);
        expect(mockDisplayReadyLog).toHaveBeenCalledTimes(1);
    });

    describe('with single client', () => {
        test('with namespace', () => {
            const options: RedisModuleOptions = { config: { namespace: 'client1' } };
            const clients = redisClientsProvider.useFactory(options);
            expect(clients.size).toBe(1);
        });

        test('without namespace', () => {
            const options: RedisModuleOptions = { config: {} };
            const clients = redisClientsProvider.useFactory(options);
            expect(clients.size).toBe(1);
        });
    });
});

describe('createRedisClientProviders', () => {
    let clients: RedisClients;
    let client1: Redis;
    let client2: Redis;

    beforeEach(async () => {
        clients = new Map();
        clients.set('client1', new Redis());
        clients.set('client2', new Redis());
        namespaces.set('client1', 'client1');
        namespaces.set('client2', 'client2');

        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: REDIS_CLIENTS, useValue: clients }, RedisManager, ...createRedisClientProviders()]
        }).compile();

        client1 = module.get<Redis>('client1');
        client2 = module.get<Redis>('client2');
    });

    afterEach(() => {
        namespaces.clear();
    });

    test('should work correctly', () => {
        expect(client1).toBeDefined();
        expect(client2).toBeDefined();
    });
});
