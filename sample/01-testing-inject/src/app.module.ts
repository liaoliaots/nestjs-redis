import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { configuration, RedisConfig } from './common/config';
import { CatsModule } from './cats/cats.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration]
        }),
        RedisModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const redisConfig = configService.get<RedisConfig>('redis');

                return {
                    closeClient: true,
                    config: {
                        ...redisConfig
                    }
                };
            },
            inject: [ConfigService]
        }),
        CatsModule
    ]
})
export class AppModule {}
