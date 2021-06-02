import { Module, DynamicModule } from '@nestjs/common';
import { RedisModuleOptions, RedisModuleAsyncOptions } from './redis-module-options.interface';
import { RedisCoreModule } from './redis-core.module';

@Module({})
export class RedisModule {
    /**
     * Registers the module synchronously.
     */
    static forRoot(options?: RedisModuleOptions): DynamicModule {
        return {
            module: RedisModule,
            imports: [RedisCoreModule.forRoot(options)]
        };
    }

    /**
     * Registers the module asynchronously.
     */
    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
        return {
            module: RedisModule,
            imports: [RedisCoreModule.forRootAsync(options)]
        };
    }
}
