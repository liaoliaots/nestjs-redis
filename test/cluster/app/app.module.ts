import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { InjectController } from './controllers/inject.controller';
import { ServiceController } from './controllers/service.controller';
import { ClusterModule } from '../../../lib';
import { testConfig } from '../../../jest-env';

@Module({
    imports: [
        TerminusModule,
        ClusterModule.forRoot({
            config: [
                {
                    namespace: 'client0',
                    startupNodes: [
                        { host: testConfig.cluster1.host, port: testConfig.cluster1.port },
                        { host: testConfig.cluster2.host, port: testConfig.cluster2.port },
                        { host: testConfig.cluster3.host, port: testConfig.cluster3.port }
                    ],
                    clusterOptions: {
                        redisOptions: {
                            password: testConfig.cluster1.password
                        }
                    }
                },
                {
                    startupNodes: [
                        { host: testConfig.cluster4.host, port: testConfig.cluster4.port },
                        { host: testConfig.cluster5.host, port: testConfig.cluster5.port },
                        { host: testConfig.cluster6.host, port: testConfig.cluster6.port }
                    ],
                    clusterOptions: {
                        redisOptions: {
                            password: testConfig.cluster4.password
                        }
                    }
                }
            ]
        })
    ],
    controllers: [HealthController, InjectController, ServiceController]
})
export class AppModule {}
