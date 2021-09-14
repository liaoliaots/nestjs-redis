# Examples

## Redis

### Default

If the redis server does **not** have a password, the host is **127.0.0.1** and the port is **6379**:

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [RedisModule.forRoot()]
})
export class AppModule {}
```

... or

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [RedisModule.forRoot({ closeClient: true })]
})
export class AppModule {}
```

... or

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [RedisModule.forRoot({ closeClient: true, config: { namespace: 'default' } })]
})
export class AppModule {}
```

### Sentinel

| name                     | ip        | port | password         |
| ------------------------ | --------- | ---- | ---------------- |
| master                   | 127.0.0.1 | 6380 | masterpassword1  |
| slave1                   | 127.0.0.1 | 6480 | masterpassword1  |
| slave2                   | 127.0.0.1 | 6481 | masterpassword1  |
| sentinel1 (**mymaster**) | 127.0.0.1 | 7380 | sentinelpassword |
| sentinel2 (**mymaster**) | 127.0.0.1 | 7381 | sentinelpassword |

> HINT: When using Sentinel in Master-Slave setup, if you want to set the passwords for Master and Slave nodes, consider having the same password for them ([#7292](https://github.com/redis/redis/issues/7292)).

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            closeClient: true,
            commonOptions: {
                sentinels: [
                    {
                        host: '127.0.0.1',
                        port: 7380
                    },
                    {
                        host: '127.0.0.1',
                        port: 7381
                    }
                ],
                sentinelPassword: 'sentinelpassword',
                password: 'masterpassword1'
            },
            config: [
                // create a master from the sentinel group
                { namespace: 'master node', name: 'mymaster', role: 'master' },
                // create a random slave from the sentinel group
                { namespace: 'slave node', name: 'mymaster', role: 'slave' }
            ]
        })
    ]
})
export class AppModule {}
```

> HINT: The `commonOptions` option works only with multiple clients.

> INFO: Read more about sentinel [here](https://github.com/luin/ioredis#sentinel).

## Cluster

### Multiple Clients

cluster 1:

| name    | ip        | port  | password         |
| ------- | --------- | ----- | ---------------- |
| master1 | 127.0.0.1 | 16380 | clusterpassword1 |
| master2 | 127.0.0.1 | 16381 | clusterpassword1 |
| master3 | 127.0.0.1 | 16382 | clusterpassword1 |

cluster 2:

| name    | ip        | port  | password         |
| ------- | --------- | ----- | ---------------- |
| master1 | 127.0.0.1 | 16480 | clusterpassword2 |
| master2 | 127.0.0.1 | 16481 | clusterpassword2 |
| master3 | 127.0.0.1 | 16482 | clusterpassword2 |

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            closeClient: true,
            config: [
                {
                    namespace: 'cluster1',
                    nodes: [{ host: '127.0.0.1', port: 16380 }],
                    options: { redisOptions: { password: 'clusterpassword1' } }
                },
                {
                    namespace: 'cluster2',
                    nodes: [{ host: '127.0.0.1', port: 16480 }],
                    options: { redisOptions: { password: 'clusterpassword2' } }
                }
            ]
        })
    ]
})
export class AppModule {}
```

> INFO: Read more about cluster [here](https://github.com/luin/ioredis#cluster).
