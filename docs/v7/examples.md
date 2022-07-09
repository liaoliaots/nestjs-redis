# Examples

## Redis

### Sentinel

| name                   | ip        | port | password    |
| ---------------------- | --------- | ---- | ----------- |
| master                 | localhost | 6381 | redismaster |
| slave1                 | localhost | 6480 | redismaster |
| slave2                 | localhost | 6481 | redismaster |
| sentinel1 (`mymaster`) | localhost | 7380 | sentinel    |
| sentinel2 (`mymaster`) | localhost | 7381 | sentinel    |

> HINT: When using Sentinel in Master-Slave setup, if you want to set the passwords for Master and Slave nodes, consider having the same password for them ([#7292](https://github.com/redis/redis/issues/7292)).

> INFO: Read more about sentinel [here](https://github.com/luin/ioredis#sentinel).

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            readyLog: true,
            commonOptions: {
                name: 'mymaster',
                sentinels: [
                    {
                        host: 'localhost',
                        port: 7380
                    },
                    {
                        host: 'localhost',
                        port: 7381
                    }
                ],
                sentinelPassword: 'sentinel',
                password: 'redismaster'
            },
            config: [
                {
                    // get master node from the sentinel group
                    role: 'master',
                    namespace: "I'm master"
                },
                {
                    // get a random slave node from the sentinel group
                    role: 'slave',
                    namespace: "I'm slave"
                }
            ]
        })
    ]
})
export class AppModule {}
```

## Cluster

### Multiple Clients

cluster 1:

| name    | ip        | port  | password |
| ------- | --------- | ----- | -------- |
| master1 | localhost | 16380 | cluster1 |
| master2 | localhost | 16381 | cluster1 |
| master3 | localhost | 16382 | cluster1 |

cluster 2:

| name    | ip        | port  | password |
| ------- | --------- | ----- | -------- |
| master1 | localhost | 16480 | cluster2 |
| master2 | localhost | 16481 | cluster2 |
| master3 | localhost | 16482 | cluster2 |

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            config: [
                {
                    namespace: 'cluster1',
                    nodes: [{ host: 'localhost', port: 16380 }],
                    redisOptions: { password: 'cluster1' }
                },
                {
                    namespace: 'cluster2',
                    nodes: [{ host: 'localhost', port: 16480 }],
                    redisOptions: { password: 'cluster2' }
                }
            ]
        })
    ]
})
export class AppModule {}
```

> INFO: Read more about cluster [here](https://github.com/luin/ioredis#cluster).
