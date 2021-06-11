import { Provider, FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisModuleOptions, RedisModuleAsyncOptions, RedisOptionsFactory, RedisClients } from './interfaces';
import { REDIS_OPTIONS, REDIS_CLIENTS, DEFAULT_REDIS_CLIENT } from './redis.constants';
import { RedisError } from '../errors';
import { createClient, namespaces } from './common';
import { RedisService } from './redis.service';

export const createProviders = (options: RedisModuleOptions): Provider[] => {
    return [
        {
            provide: REDIS_OPTIONS,
            useValue: options
        },
        redisClientsProvider
    ];
};

export const createAsyncProviders = (options: RedisModuleAsyncOptions): Provider[] => {
    if (!options.useFactory && !options.useClass && !options.useExisting)
        throw new RedisError('configuration is missing, must provide one of useFactory, useClass and useExisting');

    if (options.useClass)
        return [
            {
                provide: options.useClass,
                useClass: options.useClass
            },
            createAsyncOptionsProvider(options),
            redisClientsProvider
        ];

    if (options.useFactory) return [createAsyncOptionsProvider(options), redisClientsProvider];

    if (options.useExisting) return [createAsyncOptionsProvider(options), redisClientsProvider];

    return [];
};

export const createAsyncOptionsProvider = (options: RedisModuleAsyncOptions): Provider => {
    if (options.useClass)
        return {
            provide: REDIS_OPTIONS,
            useFactory: async (optionsFactory: RedisOptionsFactory) => await optionsFactory.createRedisOptions(),
            inject: [options.useClass]
        };

    if (options.useFactory)
        return {
            provide: REDIS_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject
        };

    if (options.useExisting)
        return {
            provide: REDIS_OPTIONS,
            useFactory: async (optionsFactory: RedisOptionsFactory) => await optionsFactory.createRedisOptions(),
            inject: [options.useExisting]
        };

    return {
        provide: REDIS_OPTIONS,
        useValue: {}
    };
};

export const redisClientsProvider: FactoryProvider<RedisClients> = {
    provide: REDIS_CLIENTS,
    useFactory: (options: RedisModuleOptions): RedisClients => {
        const clients: RedisClients = new Map();

        if (Array.isArray(options.config)) {
            options.config.forEach(client =>
                clients.set(
                    client.namespace ?? DEFAULT_REDIS_CLIENT,
                    createClient({ ...(options.defaultOptions ?? {}), ...client })
                )
            );

            return clients;
        }

        if (options.config) {
            clients.set(
                options.config.namespace ?? DEFAULT_REDIS_CLIENT,
                createClient({ ...(options.defaultOptions ?? {}), ...options.config })
            );

            return clients;
        }

        clients.set(DEFAULT_REDIS_CLIENT, createClient({}));

        return clients;
    },
    inject: [REDIS_OPTIONS]
};

export const createRedisClientProviders = (): FactoryProvider<Redis>[] => {
    const providers: FactoryProvider<Redis>[] = [];

    namespaces.forEach(namespace => {
        providers.push({
            provide: namespace,
            useFactory: (redisService: RedisService): Redis => redisService.getClient(namespace),
            inject: [RedisService]
        });
    });

    return providers;
};
