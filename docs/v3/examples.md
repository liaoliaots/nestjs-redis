## Examples

<h3 id="examples-redis">Redis</h3>

-   If your redis server has no password, the host is localhost, and the port is 6379: <span id="examples-default"></span>

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [RedisModule.forRoot()]
})
export class AppModule {}
```

or

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [RedisModule.forRoot({ config: {} })]
})
export class AppModule {}
```

or

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [RedisModule.forRoot({ config: { namespace: 'cache' } })]
})
export class AppModule {}
```

-   If redis sentinel config is: <span id="examples-sentinel"></span>

| name                     | ip        | port | password |
| ------------------------ | --------- | ---- | -------- |
| master                   | localhost | 6380 | 123456   |
| slave1                   | localhost | 6381 | 123456   |
| slave2                   | localhost | 6382 | 123456   |
| sentinel1 (**mymaster**) | localhost | 7380 | 654321   |
| sentinel2 (**mymaster**) | localhost | 7381 | 654321   |

```TypeScript
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        RedisModule.forRoot({
            defaultOptions: {
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
                sentinelPassword: '654321',
                password: '123456'
            },
            config: [
                // get master node from the sentinel group
                { name: 'mymaster', role: 'master' },
                // get a random slave node from the sentinel group, read-only by default
                { namespace: 'random slave', name: 'mymaster', role: 'slave' }
            ]
        })
    ]
})
export class AppModule {}
```

<h3 id="examples-cluster">Cluster</h3>

-   If cluster config is:

cluster 1:

| name    | ip        | port  | password |
| ------- | --------- | ----- | -------- |
| master1 | localhost | 16380 | 123456   |
| master2 | localhost | 16381 | 123456   |
| master3 | localhost | 16382 | 123456   |

cluster 2:

| name    | ip        | port  | password |
| ------- | --------- | ----- | -------- |
| master1 | localhost | 16383 | 654321   |
| master2 | localhost | 16384 | 654321   |
| master3 | localhost | 16385 | 654321   |

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ClusterModule.forRoot({
            config: [
                {
                    nodes: [{ host: 'localhost', port: 16380 }],
                    options: { redisOptions: { password: '123456' } }
                },
                {
                    namespace: 'cache',
                    nodes: [{ host: 'localhost', port: 16383 }],
                    options: { redisOptions: { password: '654321' } }
                }
            ]
        })
    ]
})
export class AppModule {}
```
