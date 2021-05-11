import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisModuleOptions, RedisModuleAsyncOptions } from './redis-module-options.interface';
import { createProviders, createAsyncProviders } from './redis.providers';

@Global()
@Module({})
export class RedisModule {
    /**
     * Register the module synchronously.
     */
    static forRoot(options: RedisModuleOptions | RedisModuleOptions[]): DynamicModule {
        const providers: Provider[] = [...createProviders(options), RedisService];

        return {
            module: RedisModule,
            providers,
            exports: providers
        };
    }

    /**
     * Register the module asynchronously.
     */
    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
        const providers: Provider[] = [...createAsyncProviders(options), RedisService];

        return {
            module: RedisModule,
            imports: options.imports ?? [],
            providers,
            exports: providers
        };
    }
}
