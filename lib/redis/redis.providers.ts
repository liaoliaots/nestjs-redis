import { Provider, FactoryProvider, ValueProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisModuleOptions, RedisModuleAsyncOptions, RedisOptionsFactory, RedisClients } from './interfaces';
import { REDIS_OPTIONS, REDIS_CLIENTS, DEFAULT_REDIS_NAMESPACE, REDIS_INTERNAL_OPTIONS } from './redis.constants';
import { createClient, namespaces, displayReadyLog } from './common';
import { RedisManager } from './redis-manager';
import { defaultRedisModuleOptions } from './default-options';

export const createOptionsProvider = (options: RedisModuleOptions): ValueProvider<RedisModuleOptions> => ({
    provide: REDIS_OPTIONS,
    useValue: { ...defaultRedisModuleOptions, ...options }
});

export const createAsyncProviders = (options: RedisModuleAsyncOptions): Provider[] => {
    if (options.useFactory) {
        return [
            {
                provide: REDIS_OPTIONS,
                useFactory(options: RedisModuleOptions) {
                    return { ...defaultRedisModuleOptions, ...options };
                },
                inject: [REDIS_INTERNAL_OPTIONS]
            },
            createAsyncOptionsProvider(options)
        ];
    }

    if (options.useClass) {
        return [
            {
                provide: options.useClass,
                useClass: options.useClass
            },
            createAsyncOptionsProvider(options)
        ];
    }

    if (options.useExisting) return [createAsyncOptionsProvider(options)];

    return [];
};

export const createAsyncOptions = async (optionsFactory: RedisOptionsFactory): Promise<RedisModuleOptions> => {
    const options = await optionsFactory.createRedisOptions();
    return { ...defaultRedisModuleOptions, ...options };
};

export const createAsyncOptionsProvider = (options: RedisModuleAsyncOptions): Provider => {
    if (options.useFactory) {
        return {
            provide: REDIS_INTERNAL_OPTIONS,
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
        }

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
