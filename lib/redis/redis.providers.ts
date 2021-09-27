import { Provider, FactoryProvider, ValueProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisModuleOptions, RedisModuleAsyncOptions, RedisOptionsFactory, RedisClients } from './interfaces';
import { REDIS_OPTIONS, REDIS_CLIENTS, DEFAULT_REDIS_NAMESPACE } from './redis.constants';
import { createClient, namespaces, displayReadyLog } from './common';
import { RedisManager } from './redis-manager';

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

    if (options.useFactory || options.useExisting) return [createAsyncOptionsProvider(options)];

    return [];
};

export const createAsyncOptions = async (optionsFactory: RedisOptionsFactory): Promise<RedisModuleOptions> =>
    await optionsFactory.createRedisOptions();

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

        if (Array.isArray(options.config) /* multiple */) {
            options.config.forEach(item =>
                clients.set(
                    item.namespace ?? DEFAULT_REDIS_NAMESPACE,
                    createClient({ ...options.commonOptions, ...item })
                )
            );
        } else if (options.config /* single */) {
            clients.set(options.config.namespace ?? DEFAULT_REDIS_NAMESPACE, createClient(options.config));
        } else clients.set(DEFAULT_REDIS_NAMESPACE, createClient({}));

        if (options.readyLog) displayReadyLog(clients);

        return clients;
    },
    inject: [REDIS_OPTIONS]
};

export const createRedisClientProviders = (): FactoryProvider<Redis>[] => {
    const providers: FactoryProvider<Redis>[] = [];
    namespaces.forEach((token, namespace) => {
        providers.push({
            provide: token,
            useFactory: (redisManager: RedisManager) => redisManager.getClient(namespace),
            inject: [RedisManager]
        });
    });
    return providers;
};
