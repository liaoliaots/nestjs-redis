import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: 'localhost',
        port: 6380,
        password: 'bitnami'
      }
    }),
    CatsModule
  ]
})
export class AppModule {}
