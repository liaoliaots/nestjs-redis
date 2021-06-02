import { Module, Global, DynamicModule, Provider } from '@nestjs/common';
import { RedisModuleOptions, RedisModuleAsyncOptions } from './redis-module-options.interface';
import { RedisService } from './redis.service';
import { createProviders, createAsyncProviders, createRedisClientProviders } from './redis.providers';

@Global()
@Module({})
export class RedisCoreModule {
    static forRoot(options: RedisModuleOptions = {}): DynamicModule {
        const redisClientProviders = createRedisClientProviders();
        const providers: Provider[] = [...createProviders(options), RedisService, ...redisClientProviders];

        return {
            module: RedisCoreModule,
            providers,
            exports: [RedisService, ...redisClientProviders]
        };
    }

    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
        const redisClientProviders = createRedisClientProviders();
        const providers: Provider[] = [...createAsyncProviders(options), RedisService, ...redisClientProviders];

        return {
            module: RedisCoreModule,
            imports: options.imports,
            providers,
            exports: [RedisService, ...redisClientProviders]
        };
    }
}
