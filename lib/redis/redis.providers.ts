import { Provider, FactoryProvider, ValueProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisModuleOptions, RedisModuleAsyncOptions, RedisOptionsFactory, RedisClients } from './interfaces';
import { REDIS_OPTIONS, REDIS_CLIENTS, DEFAULT_REDIS_NAMESPACE } from './redis.constants';
import { RedisError, MISSING_CONFIGURATION } from '@/errors';
import { createClient, namespaces } from './common';
import { RedisService } from './redis.service';

export const createProviders = (options: RedisModuleOptions): ValueProvider<RedisModuleOptions> => ({
    provide: REDIS_OPTIONS,
    useValue: options
});

export const createAsyncProviders = (options: RedisModuleAsyncOptions): Provider[] => {
    if (!options.useFactory && !options.useClass && !options.useExisting) throw new RedisError(MISSING_CONFIGURATION);

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
            useFactory: async (optionsFactory: RedisOptionsFactory): Promise<RedisModuleOptions> =>
                await optionsFactory.createRedisOptions(),
            inject: [options.useClass]
        };
    }

    if (options.useExisting) {
        return {
            provide: REDIS_OPTIONS,
            useFactory: async (optionsFactory: RedisOptionsFactory): Promise<RedisModuleOptions> =>
                await optionsFactory.createRedisOptions(),
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
                    item.namespace ?? DEFAULT_REDIS_NAMESPACE,
                    createClient({ ...options.defaultOptions, ...item })
                )
            );

            return clients;
        }

        if (options.config) {
            clients.set(options.config.namespace ?? DEFAULT_REDIS_NAMESPACE, createClient(options.config));

            return clients;
        }

        clients.set(DEFAULT_REDIS_NAMESPACE, createClient({}));

        return clients;
    },
    inject: [REDIS_OPTIONS]
};

export const createRedisClientProviders = (): FactoryProvider<Redis>[] => {
    const providers: FactoryProvider<Redis>[] = [];

    namespaces.forEach(namespace => {
        providers.push({
            provide: namespace,
            useFactory: (redisService: RedisService) => redisService.getClient(namespace),
            inject: [RedisService]
        });
    });

    return providers;
};
