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
              nodes: [{ host: '127.0.0.1', port: 7380 }],
              redisOptions: { password: 'mycluster' }
            },
            {
              namespace: 'client1',
              nodes: [{ host: '127.0.0.1', port: 7380 }],
              redisOptions: { password: 'mycluster' }
            }
          ]
        };
      }
    })
  ],
  controllers: [InjectController, ManagerController]
})
export class AppModule {}
