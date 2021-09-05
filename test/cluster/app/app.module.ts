import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { InjectController } from './controllers/inject.controller';
import { ServiceController } from './controllers/service.controller';
import { ClusterModule } from '../../../lib';
import { RedisHealthModule } from '@/health';

@Module({
    imports: [
        ClusterModule.forRoot({
            config: [
                {
                    namespace: 'client0',
                    nodes: [{ host: '127.0.0.1', port: 16380 }],
                    options: { redisOptions: { password: 'clusterpassword1' } }
                },
                {
                    nodes: [{ host: '127.0.0.1', port: 16480 }],
                    options: { redisOptions: { password: 'clusterpassword2' } }
                }
            ]
        }),
        TerminusModule,
        RedisHealthModule
    ],
    controllers: [HealthController, InjectController, ServiceController]
})
export class AppModule {}
