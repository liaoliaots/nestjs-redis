import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot(
            {
                readyLog: true,
                config: {
                    nodes: [{ host: 'localhost', port: 16380 }],
                    options: { redisOptions: { password: 'cluster1' } }
                }
            },
            false
        )
    ],
    exports: [ClusterModule]
})
export class SharedCluster {}
