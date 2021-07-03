import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { InjectController } from './controllers/inject.controller';
import { ServiceController } from './controllers/service.controller';
import { ClusterModule } from '../../../lib';
import { testConfig } from '../../env';

@Module({
    imports: [
        TerminusModule,
        ClusterModule.forRoot({
            config: [
                {
                    namespace: 'client0',
                    nodes: [{ host: testConfig.cluster1.host, port: testConfig.cluster1.port }],
                    options: { redisOptions: { password: testConfig.cluster1.password } }
                },
                {
                    nodes: [{ host: testConfig.cluster4.host, port: testConfig.cluster4.port }],
                    options: { redisOptions: { password: testConfig.cluster4.password } }
                }
            ]
        })
    ],
    controllers: [HealthController, InjectController, ServiceController]
})
export class AppModule {}
