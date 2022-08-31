import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ClusterModule, ClusterModuleOptions } from '@/.';
import { RedisHealthModule } from '@health/.';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    ClusterModule.forRootAsync({
      useFactory(): ClusterModuleOptions {
        return {
          config: [
            {
              nodes: [{ host: '127.0.0.1', port: 16380 }],
              redisOptions: { password: 'cluster1' }
            },
            {
              namespace: 'client1',
              nodes: [{ host: '127.0.0.1', port: 16480 }],
              redisOptions: { password: 'cluster2' }
            }
          ]
        };
      }
    }),
    TerminusModule,
    RedisHealthModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
