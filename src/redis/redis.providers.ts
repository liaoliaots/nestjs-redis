import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import {
    RedisModuleOptions,
    RedisModuleAsyncOptions,
    RedisOptionsFactory,
    ClientNamespace
} from './redis-module-options.interface';
import { REDIS_OPTIONS, REDIS_CLIENTS, DEFAULT_REDIS_CLIENT } from './redis.constants';
import { RedisError } from '../errors/redis.error';
import { RedisClients } from './redis.interface';
import { createClient } from './redis-utils';

/**
 * Creates an array of providers for forRoot.
 */
export const createProviders = (options: RedisModuleOptions | RedisModuleOptions[]): Provider[] => {
    return [
        {
            provide: REDIS_OPTIONS,
            useValue: options
        },
        redisClientsProvider
    ];
};

/**
 * Creates an array of providers for forRootAsync.
 */
export const createAsyncProviders = (options: RedisModuleAsyncOptions): Provider[] => {
    if (!options.useFactory && !options.useClass && !options.useExisting) {
        throw new RedisError('configuration is missing, must provide one of useFactory, useClass and useExisting');
    }

    if (options.useClass) {
        return [
            {
                provide: options.useClass,
                useClass: options.useClass
            },
            createAsyncOptionsProvider(options),
            redisClientsProvider
        ];
    }

    if (options.useFactory || options.useExisting) return [createAsyncOptionsProvider(options), redisClientsProvider];

    return [];
};

/**
 * Creates async options provider.
 */
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
            useFactory: async (optionsFactory: RedisOptionsFactory) => await optionsFactory.createRedisModuleOptions(),
            inject: [options.useClass]
        };
    }

    if (options.useExisting) {
        return {
            provide: REDIS_OPTIONS,
            useFactory: async (optionsFactory: RedisOptionsFactory) => await optionsFactory.createRedisModuleOptions(),
            inject: [options.useExisting]
        };
    }

    return {
        provide: REDIS_OPTIONS,
        useValue: {}
    };
};

/**
 * Creates redis clients provider.
 */
export const redisClientsProvider: Provider = {
    provide: REDIS_CLIENTS,
    useFactory: (options: RedisModuleOptions | RedisModuleOptions[]): RedisClients => {
        const clients: RedisClients = new Map<ClientNamespace, Redis>();

        if (Array.isArray(options)) {
            options.forEach(item => clients.set(item.namespace ?? DEFAULT_REDIS_CLIENT, createClient(item)));

            return clients;
        }

        clients.set(options.namespace ?? DEFAULT_REDIS_CLIENT, createClient(options));

        return clients;
    },
    inject: [REDIS_OPTIONS]
};
