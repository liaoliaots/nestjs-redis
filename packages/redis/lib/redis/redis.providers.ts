import { Provider, FactoryProvider, ValueProvider } from '@nestjs/common';
import { RedisModuleOptions, RedisModuleAsyncOptions, RedisOptionsFactory, RedisClients } from './interfaces';
import { REDIS_OPTIONS, REDIS_CLIENTS, DEFAULT_REDIS, REDIS_MERGED_OPTIONS } from './redis.constants';
import { createClient } from './common';
import { defaultRedisModuleOptions } from './default-options';

export const createOptionsProvider = (options: RedisModuleOptions): ValueProvider<RedisModuleOptions> => ({
  provide: REDIS_OPTIONS,
  useValue: options
});

export const createAsyncProviders = (options: RedisModuleAsyncOptions): Provider[] => {
  if (options.useClass) {
    return [
      {
        provide: options.useClass,
        useClass: options.useClass
      },
      createAsyncOptionsProvider(options)
    ];
  }

  if (options.useExisting || options.useFactory) return [createAsyncOptionsProvider(options)];

  return [];
};

export const createAsyncOptions = async (optionsFactory: RedisOptionsFactory): Promise<RedisModuleOptions> => {
  return await optionsFactory.createRedisOptions();
};

export const createAsyncOptionsProvider = (options: RedisModuleAsyncOptions): Provider => {
  if (options.useFactory) {
    return {
      provide: REDIS_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject
    };
  }

  if (options.useClass) {
    return {
      provide: REDIS_OPTIONS,
      useFactory: createAsyncOptions,
      inject: [options.useClass]
    };
  }

  if (options.useExisting) {
    return {
      provide: REDIS_OPTIONS,
      useFactory: createAsyncOptions,
      inject: [options.useExisting]
    };
  }

  return {
    provide: REDIS_OPTIONS,
    useValue: {}
  };
};

export const redisClientsProvider: FactoryProvider<RedisClients> = {
  provide: REDIS_CLIENTS,
  useFactory: (options: RedisModuleOptions) => {
    const clients: RedisClients = new Map();
    if (Array.isArray(options.config)) {
      options.config.forEach(item =>
        clients.set(
          item.namespace ?? DEFAULT_REDIS,
          createClient(
            { ...options.commonOptions, ...item },
            { readyLog: options.readyLog, errorLog: options.errorLog }
          )
        )
      );
    } else if (options.config) {
      clients.set(
        options.config.namespace ?? DEFAULT_REDIS,
        createClient(options.config, { readyLog: options.readyLog, errorLog: options.errorLog })
      );
    }
    return clients;
  },
  inject: [REDIS_MERGED_OPTIONS]
};

export const mergedOptionsProvider: FactoryProvider<RedisModuleOptions> = {
  provide: REDIS_MERGED_OPTIONS,
  useFactory: (options: RedisModuleOptions) => ({ ...defaultRedisModuleOptions, ...options }),
  inject: [REDIS_OPTIONS]
};
