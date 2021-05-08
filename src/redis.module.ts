import { Module, DynamicModule } from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisModuleOptions, RedisModuleAsyncOptions } from './redis.interface';

@Module({})
export class RedisModule {
    static forRoot(options: RedisModuleOptions): DynamicModule {
        return {
            module: RedisModule,
            global: true,
            providers: [
                {
                    provide: REDIS_MODULE_OPTIONS,
                    useValue: options
                },
                RedisService
            ],
            exports: [RedisService]
        };
    }

    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
        return {};
    }
}
