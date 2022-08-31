import { Module } from '@nestjs/common';
import { ClusterModule, ClusterModuleOptions } from '@/.';
import { InjectController } from './controllers/inject.controller';
import { ManagerController } from './controllers/manager.controller';

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
    })
  ],
  controllers: [InjectController, ManagerController]
})
export class AppModule {}
