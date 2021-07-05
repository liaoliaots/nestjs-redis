import { Module, Global, DynamicModule, Provider, OnApplicationShutdown, Inject } from '@nestjs/common';
import { RedisModuleOptions, RedisModuleAsyncOptions, RedisClients } from './interfaces';
import { RedisService } from './redis.service';
import { createProviders, createAsyncProviders, createRedisClientProviders } from './redis.providers';
import { REDIS_OPTIONS, REDIS_CLIENTS } from './redis.constants';
import { RedisHealthIndicator } from './redis.health';
import { quitClients } from './common';
import { checkPackages } from '../utils';

checkPackages(['ioredis', '@nestjs/terminus']);

@Global()
@Module({})
export class RedisCoreModule implements OnApplicationShutdown {
    constructor(
        @Inject(REDIS_OPTIONS) private readonly options: RedisModuleOptions,
        @Inject(REDIS_CLIENTS) private readonly clients: RedisClients
    ) {}

    static forRoot(options: RedisModuleOptions = {}): DynamicModule {
        const redisClientProviders = createRedisClientProviders();
        const providers: Provider[] = [
            ...createProviders(options),
            RedisService,
            RedisHealthIndicator,
            ...redisClientProviders
        ];

        return {
            module: RedisCoreModule,
            providers,
            exports: [RedisService, RedisHealthIndicator, ...redisClientProviders]
        };
    }

    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
        const redisClientProviders = createRedisClientProviders();
        const providers: Provider[] = [
            ...createAsyncProviders(options),
            RedisService,
            RedisHealthIndicator,
            ...redisClientProviders
        ];

        return {
            module: RedisCoreModule,
            imports: options.imports,
            providers,
            exports: [RedisService, RedisHealthIndicator, ...redisClientProviders]
        };
    }

    onApplicationShutdown(): void {
        if (this.options.closeClient) quitClients(this.clients);
    }
}
