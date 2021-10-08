import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RedisModule } from '@/.';
import { RedisHealthModule } from '@/health';
import { RedisConfigService } from './redis-config.service';
import { HealthController } from './controllers/health.controller';
import { InjectController } from './controllers/inject.controller';
import { ManagerController } from './controllers/manager.controller';

@Module({
    imports: [
        RedisModule.forRootAsync({
            useClass: RedisConfigService
        }),
        TerminusModule,
        RedisHealthModule
    ],
    controllers: [HealthController, InjectController, ManagerController]
})
export class AppModule {}
