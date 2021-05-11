import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisModuleOptions, RedisModuleAsyncOptions, RedisOptionsFactory } from './redis-module-options.interface';
import { REDIS_OPTIONS, REDIS_CLIENTS } from './redis.constants';
import { RedisClientError } from './redis.error';
import { ClientName } from './redis-module-options.interface';
import { RedisClients } from './redis.interface';
import { createClient } from './redis-utils';

/**
 * Creates redis clients rrovider
 */
export const redisClientProvider: Provider = {
    provide: REDIS_CLIENTS,
    useFactory: (options: RedisModuleOptions | RedisModuleOptions[]): RedisClients => {
        const clients: RedisClients = new Map<ClientName, Redis>();

        if (Array.isArray(options)) options.forEach(item => clients.set(item.name, createClient(item)));
        else clients.set(options.name, createClient(options));

        return clients;
    },
    inject: [REDIS_OPTIONS]
};

/**
 * Creates an array of providers for forRoot
 *
 * @param options - The options of redis module
 */
export const createProviders = (options: RedisModuleOptions | RedisModuleOptions[]): Provider[] => {
    return [
        {
            provide: REDIS_OPTIONS,
            useValue: options
        },
        redisClientProvider
    ];
};

/**
 * Creates options provider asynchronously.
 *
 * @param options - The async options of redis module
 */
const createAsyncOptionsProvider = (options: RedisModuleAsyncOptions): Provider => {
    if (options.useFactory)
        return {
            provide: REDIS_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject ?? []
        };

    if (options.useClass)
        return {
            provide: REDIS_OPTIONS,
            useFactory: async (optionsFactory: RedisOptionsFactory) => await optionsFactory.createRedisModuleOptions(),
            inject: [options.useClass]
        };

    if (options.useExisting)
        return {
            provide: REDIS_OPTIONS,
            useFactory: async (optionsFactory: RedisOptionsFactory) => await optionsFactory.createRedisModuleOptions(),
            inject: [options.useExisting]
        };

    return {
        provide: REDIS_OPTIONS,
        useValue: {}
    };
};

/**
 * Creates an array of providers for forRootAsync
 *
 * @param options - The async options of redis module
 */
export const createAsyncProviders = (options: RedisModuleAsyncOptions): Provider[] => {
    if (!options.useFactory && !options.useClass && !options.useExisting)
        throw new RedisClientError('Require configuration, must provide useFactory, useClass or useExisting');

    if (options.useClass)
        return [
            createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass
            },
            redisClientProvider
        ];

    if (options.useFactory || options.useExisting) return [createAsyncOptionsProvider(options), redisClientProvider];

    return [];
};
