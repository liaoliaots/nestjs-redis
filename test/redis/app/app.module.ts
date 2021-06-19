import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RedisModule } from '../../../lib';
import { testConfig } from '../../../lib/utils';
import { HealthController } from './controllers/health.controller';
import { InjectController } from './controllers/inject.controller';
import { ServiceController } from './controllers/service.controller';

export const CLIENT_0 = 'client0';

@Module({
    imports: [
        TerminusModule,
        RedisModule.forRoot({
            defaultOptions: testConfig,
            config: [{ namespace: 'client0', db: 0 }, { db: 1 }]
        })
    ],
    controllers: [HealthController, InjectController, ServiceController]
})
export class AppModule {}
