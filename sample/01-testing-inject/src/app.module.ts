import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CatsModule } from './cats/cats.module';

@Module({
    imports: [
        RedisModule.forRoot({
            readyLog: true,
            config: {
                namespace: 'default',
                host: '127.0.0.1',
                port: 6380,
                password: 'bitnami'
            }
        }),
        CatsModule
    ]
})
export class AppModule {}
