import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { redisConfig } from './common/config';
import { CatsModule } from './cats/cats.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [redisConfig]
        }),
        RedisModule.forRootAsync({
            useFactory: (redis: ConfigType<typeof redisConfig>) => {
                return {
                    closeClient: true,
                    config: {
                        ...redis
                    }
                };
            },
            inject: [redisConfig.KEY]
        }),
        CatsModule
    ]
})
export class AppModule {}
