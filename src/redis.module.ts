import { Module, DynamicModule, Provider } from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_OPTIONS } from './redis.constants';
import { RedisModuleOptions, RedisModuleAsyncOptions, RedisModuleOptionsFactory } from './redis.interface';
import { createProviders } from './redis.providers';

@Module({})
export class RedisModule {
    static forRoot(options: RedisModuleOptions): DynamicModule {
        return {
            module: RedisModule,
            global: options.isGlobal,
            providers: [...createProviders(options), RedisService],
            exports: [RedisService]
        };
    }

    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
        return {};
    }

    private static createAsyncProviders(options: RedisModuleAsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass
            }
        ];
    }

    private static createAsyncOptionsProvider(options: RedisModuleAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: REDIS_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            provide: REDIS_OPTIONS,
            useFactory: async (optionsFactory: RedisModuleOptionsFactory) =>
                await optionsFactory.createRedisModuleOptions(),
            inject: [options.useExisting || options.useClass]
        };
    }
}
