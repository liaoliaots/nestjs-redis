import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RedisModule } from '@liaoliaots/nestjs-redis/lib';
import { RedisHealthModule } from '@health/.';
import { RedisConfigService } from './redis-config.service';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useClass: RedisConfigService
    }),
    TerminusModule,
    RedisHealthModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
