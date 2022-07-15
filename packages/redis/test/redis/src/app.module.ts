import { Module } from '@nestjs/common';
import { RedisModule } from '@/.';
import { RedisConfigService } from './redis-config.service';
import { InjectController } from './controllers/inject.controller';
import { ManagerController } from './controllers/manager.controller';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useClass: RedisConfigService
    })
  ],
  controllers: [InjectController, ManagerController]
})
export class AppModule {}
