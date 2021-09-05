import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CatsModule } from './cats/cats.module';

@Module({
    imports: [
        RedisModule.forRoot({
            closeClient: true,
            config: {
                host: '127.0.0.1',
                port: 6380,
                password: 'masterpassword1'
            }
        }),
        CatsModule
    ]
})
export class AppModule {}
