## Usage

**1**, install the required package:

```sh
$ npm install --save @nestjs/terminus
```

**2**, import `TerminusModule` and `RedisHealthModule` into the imports array:

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis/health';
import { AppController } from './app.controller';

@Module({
    imports: [
        RedisModule.forRoot({
            readyLog: true,
            config: {
                host: 'localhost',
                port: 6380,
                password: 'redismain'
            }
        }),
        TerminusModule,
        RedisHealthModule
    ],
    controllers: [AppController]
})
export class AppModule {}
```

> INFO: Read more about `@nestjs/terminus` [here](https://docs.nestjs.com/recipes/terminus).

> HINT: Neither `TerminusModule` nor `RedisHealthModule` is global module.

**3**, let's setup `AppController`:

```ts
// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis/health';
import Redis from 'ioredis';

@Controller()
export class AppController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly redisIndicator: RedisHealthIndicator,
        @InjectRedis() private readonly redis: Redis
    ) {}

    @Get('health')
    @HealthCheck()
    async healthChecks(): Promise<HealthCheckResult> {
        return await this.health.check([
            () => this.redisIndicator.checkHealth('redis', { type: 'redis', client: this.redis, timeout: 500 })
        ]);
    }
}
```

**4**, if your redis server is reachable, you should now see the following JSON-result when requesting http://localhost:3000/health with a GET request:

```json
{
    "status": "ok",
    "info": {
        "redis": {
            "status": "up"
        }
    },
    "error": {},
    "details": {
        "redis": {
            "status": "up"
        }
    }
}
```

## Settings

### Redis

| Name            | Type      | Default     | Required | Description                                                                                           |
| --------------- | --------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------- |
| type            | `'redis'` | `undefined` | `true`   | Server type. You must specify what Redis server type you use. Possible values are "redis", "cluster". |
| client          | `Redis`   | `undefined` | `true`   | The client which the health check should get executed.                                                |
| timeout         | `number`  | `1000`      | `false`  | The amount of time the check should require in `ms`.                                                  |
| memoryThreshold | `number`  | `undefined` | `false`  | The maximum amount of memory used by redis in `bytes`.                                                |

### Cluster

| Name   | Type        | Default     | Required | Description                                                                                           |
| ------ | ----------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------- |
| type   | `'cluster'` | `undefined` | `true`   | Server type. You must specify what Redis server type you use. Possible values are "redis", "cluster". |
| client | `Cluster`   | `undefined` | `true`   | The client which the health check should get executed.                                                |
