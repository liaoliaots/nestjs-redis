import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { InjectController } from './controllers/inject.controller';
import { ServiceController } from './controllers/service.controller';
import { RedisModule } from '@/index';
import { RedisHealthModule } from '@/health';

@Module({
    imports: [
        RedisModule.forRoot({
            closeClient: true,
            config: [
                { host: '127.0.0.1', port: 6380, password: 'masterpassword1' },
                { namespace: 'client0', host: '127.0.0.1', port: 6381, password: 'masterpassword2' }
            ]
        }),
        TerminusModule,
        RedisHealthModule
    ],
    controllers: [HealthController, InjectController, ServiceController]
})
export class AppModule {}
