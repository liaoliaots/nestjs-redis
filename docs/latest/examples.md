## Redis

### Sentinel

| name                   | ip        | port | password    |
| ---------------------- | --------- | ---- | ----------- |
| master                 | localhost | 6381 | redismaster |
| slave1                 | localhost | 6480 | redismaster |
| slave2                 | localhost | 6481 | redismaster |
| sentinel1 (`mymaster`) | localhost | 7380 | sentinel    |
| sentinel2 (`mymaster`) | localhost | 7381 | sentinel    |

> INFO: Read more about ioredis sentinel [here](https://github.com/luin/ioredis#sentinel).

> HINT: When using Sentinel in Master-Slave setup, if you want to set the passwords for Master and Slave nodes, consider having the same password for them ([#7292](https://github.com/redis/redis/issues/7292)).

```ts
// app.module.ts
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
