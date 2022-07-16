import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';
import {
  createOptionsProvider,
  createAsyncProviders,
  createAsyncOptionsProvider,
  redisClientsProvider,
  createRedisClientProviders,
  createAsyncOptions,
  mergedOptionsProvider
} from './redis.providers';
import { RedisOptionsFactory, RedisModuleAsyncOptions, RedisClients, RedisModuleOptions } from './interfaces';
import { REDIS_OPTIONS, REDIS_CLIENTS, REDIS_MERGED_OPTIONS } from './redis.constants';
import { namespaces } from './common';
import { RedisManager } from './redis-manager';
import { defaultRedisModuleOptions } from './default-options';

jest.mock('ioredis', () => jest.fn(() => ({})));

describe('createOptionsProvider', () => {
  test('should work correctly', () => {
    expect(createOptionsProvider({})).toEqual({
      provide: REDIS_OPTIONS,
      useValue: {}
    });
  });
});

describe('createAsyncProviders', () => {
  class RedisConfigService implements RedisOptionsFactory {
    createRedisOptions(): RedisModuleOptions {
      return {};
    }
  }

  test('with useFactory', () => {
    const result = createAsyncProviders({ useFactory: () => ({}), inject: [] });
    expect(result).toHaveLength(1);
    expect(result).toPartiallyContain({ provide: REDIS_OPTIONS, inject: [] });
    expect(result[0]).toHaveProperty('useFactory');
  });

  test('with useClass', () => {
    const result = createAsyncProviders({ useClass: RedisConfigService });
    expect(result).toHaveLength(2);
    expect(result).toIncludeAllPartialMembers([
      { provide: RedisConfigService, useClass: RedisConfigService },
      { provide: REDIS_OPTIONS, inject: [RedisConfigService] }
    ]);
    expect(result[1]).toHaveProperty('useFactory');
  });

  test('with useExisting', () => {
    const result = createAsyncProviders({ useExisting: RedisConfigService });
    expect(result).toHaveLength(1);
    expect(result).toIncludeAllPartialMembers([{ provide: REDIS_OPTIONS, inject: [RedisConfigService] }]);
    expect(result[0]).toHaveProperty('useFactory');
  });

  test('without options', () => {
    const result = createAsyncProviders({});
    expect(result).toHaveLength(0);
  });
});

describe('createAsyncOptions', () => {
  test('should work correctly', async () => {
    const redisConfigService: RedisOptionsFactory = {
      createRedisOptions(): RedisModuleOptions {
        return { closeClient: true };
      }
    };
    await expect(createAsyncOptions(redisConfigService)).resolves.toEqual({ closeClient: true });
  });
});

describe('createAsyncOptionsProvider', () => {
  class RedisConfigService implements RedisOptionsFactory {
    createRedisOptions(): RedisModuleOptions {
      return {};
    }
  }

  test('with useFactory', () => {
    const options: RedisModuleAsyncOptions = { useFactory: () => ({}), inject: ['token'] };
    expect(createAsyncOptionsProvider(options)).toEqual({ provide: REDIS_OPTIONS, ...options });
  });

  test('with useClass', () => {
    const options: RedisModuleAsyncOptions = { useClass: RedisConfigService };
    expect(createAsyncOptionsProvider(options)).toHaveProperty('provide', REDIS_OPTIONS);
    expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
    expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [RedisConfigService]);
  });

  test('with useExisting', () => {
    const options: RedisModuleAsyncOptions = { useExisting: RedisConfigService };
    expect(createAsyncOptionsProvider(options)).toHaveProperty('provide', REDIS_OPTIONS);
    expect(createAsyncOptionsProvider(options)).toHaveProperty('useFactory');
    expect(createAsyncOptionsProvider(options)).toHaveProperty('inject', [RedisConfigService]);
  });

  test('without options', () => {
    expect(createAsyncOptionsProvider({})).toEqual({ provide: REDIS_OPTIONS, useValue: {} });
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

describe('redisClientsProvider', () => {
  test('should be a dynamic module', () => {
    expect(redisClientsProvider).toHaveProperty('provide', REDIS_CLIENTS);
    expect(redisClientsProvider).toHaveProperty('useFactory');
    expect(redisClientsProvider).toHaveProperty('inject', [REDIS_MERGED_OPTIONS]);
  });

  test('with multiple clients', async () => {
    const options: RedisModuleOptions = { config: [{}, { namespace: 'client1' }] };
    const clients = await redisClientsProvider.useFactory(options);
    expect(clients.size).toBe(2);
  });

  describe('with single client', () => {
    test('with namespace', async () => {
      const options: RedisModuleOptions = { config: { namespace: 'client1' } };
      const clients = await redisClientsProvider.useFactory(options);
      expect(clients.size).toBe(1);
    });

    test('without namespace', async () => {
      const options: RedisModuleOptions = { config: {} };
      const clients = await redisClientsProvider.useFactory(options);
      expect(clients.size).toBe(1);
    });
  });
});

describe('mergedOptionsProvider', () => {
  test('should be a dynamic module', () => {
    expect(mergedOptionsProvider).toHaveProperty('provide', REDIS_MERGED_OPTIONS);
    expect(mergedOptionsProvider).toHaveProperty('useFactory');
    expect(mergedOptionsProvider).toHaveProperty('inject', [REDIS_OPTIONS]);
  });

  test('should work correctly', async () => {
    const options: RedisModuleOptions = { closeClient: false };
    const mergedOptions = await mergedOptionsProvider.useFactory(options);
    expect(mergedOptions).toEqual({ ...defaultRedisModuleOptions, ...options });
  });
});
