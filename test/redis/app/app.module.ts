import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { InjectController } from './controllers/inject.controller';
import { ServiceController } from './controllers/service.controller';
import { RedisModule } from '../../../lib';
import { testConfig } from '../../env';

@Module({
    imports: [
        TerminusModule,
        RedisModule.forRoot({
            defaultOptions: {
                sentinels: [
                    {
                        host: testConfig.sentinel1.host,
                        port: testConfig.sentinel1.port
                    },
                    {
                        host: testConfig.sentinel2.host,
                        port: testConfig.sentinel2.port
                    }
                ],
                sentinelPassword: testConfig.sentinel1.password,
                password: testConfig.master.password
            },
            config: [
                { namespace: 'client0', db: 0, name: 'mymaster', role: 'master' },
                { db: 1, name: 'mymaster', role: 'slave' }
            ]
        })
    ],
    controllers: [HealthController, InjectController, ServiceController]
})
export class AppModule {}
