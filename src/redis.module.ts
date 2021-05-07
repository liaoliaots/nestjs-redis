import { Module, DynamicModule } from '@nestjs/common';
import { RedisOptions } from 'ioredis';
import { RedisService } from './redis.service';
import { REDIS_MODULE_OPTIONS } from './redis.constants';

@Module({})
export class RedisModule {
    static forRoot(options: RedisOptions): DynamicModule {
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
}
