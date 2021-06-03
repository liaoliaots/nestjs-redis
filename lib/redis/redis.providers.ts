import { Provider } from '@nestjs/common';
import { RedisModuleOptions, RedisModuleAsyncOptions, RedisOptionsFactory, RedisClients } from './interfaces';
import { REDIS_OPTIONS, REDIS_CLIENTS, DEFAULT_REDIS_CLIENT } from './redis.constants';
import { RedisError } from '../errors/redis.error';
import { createClient, namespaces, parseNamespace } from './common';

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
            useFactory: async (optionsFactory: RedisOptionsFactory) => await optionsFactory.createRedisOptions(),
            inject: [options.useClass]
        };
    }

    if (options.useExisting) {
        return {
            provide: REDIS_OPTIONS,
            useFactory: async (optionsFactory: RedisOptionsFactory) => await optionsFactory.createRedisOptions(),
            inject: [options.useExisting]
        };
    }

    return {
        provide: REDIS_OPTIONS,
        useValue: {}
    };
};

export const redisClientsProvider: Provider = {
    provide: REDIS_CLIENTS,
    useFactory: (options: RedisModuleOptions): RedisClients => {
        const clients: RedisClients = new Map();

        if (Array.isArray(options.clients)) {
            options.clients.forEach(client =>
                clients.set(client.namespace ?? DEFAULT_REDIS_CLIENT, createClient(client))
            );

            return clients;
        }

        if (options.clients) {
            clients.set(options.clients.namespace ?? DEFAULT_REDIS_CLIENT, createClient(options.clients));

            return clients;
        }

        clients.set(DEFAULT_REDIS_CLIENT, createClient({}));

        return clients;
    },
    inject: [REDIS_OPTIONS]
};

export const createRedisClientProviders = (): Provider[] => {
    const providers: Provider[] = [];

    namespaces.forEach(namespace => {
        providers.push({
            provide: namespace,
            useFactory: (redisClients: RedisClients) => {
                const client = redisClients.get(namespace);

                if (!client) throw new RedisError(`Unable to find the '${parseNamespace(namespace)}' client`);

                return client;
            },
            inject: [REDIS_CLIENTS]
        });
    });

    return providers;
};
