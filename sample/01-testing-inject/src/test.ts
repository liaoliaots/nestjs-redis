import { Module } from '@nestjs/common';
import { RedisModule, RedisService, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            readyLog: true,
            config: {
                host: 'localhost',
                port: 6380,
                password: 'redismain'
            }
        }),
        ThrottlerModule.forRootAsync({
            useFactory(redisService: RedisService) {
                const redis = redisService.getClient(DEFAULT_REDIS_NAMESPACE);
                return { ttl: 60, limit: 10, storage: new ThrottlerStorageRedisService(redis) };
            },
            inject: [RedisService]
        })
    ]
})
export class AppModule {}
