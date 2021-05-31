import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { RedisModuleOptions, RedisModuleAsyncOptions } from './redis-module-options.interface';
import { RedisService } from './redis.service';
import { createProviders, createAsyncProviders, createRedisClientProviders } from './redis.providers';

@Global()
@Module({})
export class RedisModule {
    /**
     * Register the module synchronously.
     */
    static forRoot(options: RedisModuleOptions | RedisModuleOptions[] = {}): DynamicModule {
        const redisClientProviders = createRedisClientProviders();
        const providers: Provider[] = [...createProviders(options), RedisService, ...redisClientProviders];

        return {
            module: RedisModule,
            providers,
            exports: [RedisService, ...redisClientProviders]
        };
    }

    /**
     * Register the module asynchronously.
     */
    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
        const redisClientProviders = createRedisClientProviders();
        const providers: Provider[] = [...createAsyncProviders(options), RedisService, ...redisClientProviders];

        return {
            module: RedisModule,
            imports: options.imports,
            providers,
            exports: [RedisService, ...redisClientProviders]
        };
    }
}
