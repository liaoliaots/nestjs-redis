## Usage

**1**, install the required package:

```sh
$ npm install --save @nestjs/terminus
```

**2**, import `TerminusModule` and `RedisHealthModule` into the business module:

```TypeScript
// app.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TerminusModule } from '@nestjs/terminus';
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

> HINT: Both `TerminusModule` and `RedisHealthModule` aren't global modules. Read more about `@nestjs/terminus` [here](https://docs.nestjs.com/recipes/terminus).

**3**, let's create health checks:

```TypeScript
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
            () => this.redisIndicator.checkHealth('redis', { type: 'redis', client: this.redis })
        ]);
    }
}
```

If your redis and cluster servers are reachable, you should now see the following JSON-result when requesting http://localhost:3000/health with a GET request:

```json
{
    "status": "ok",
    "info": {
        "redis": {
            "status": "up"
        },
        "cluster": {
            "status": "up"
        }
    },
    "error": {},
    "details": {
        "redis": {
            "status": "up"
        },
        "cluster": {
            "status": "up"
        }
    }
}
```

## Settings

### Redis

```TypeScript
interface checkHealth {
    (key: string, options: { type: 'redis'; client: Redis; timeout?: number; memoryThreshold?: number }): Promise<HealthIndicatorResult>;
}
```

-   **key**: The key which will be used for the result object.
-   **type**: Server type. You must specify what Redis server type you use. Possible values are "redis", "cluster". This option is required.
-   **client**: The client which the health check should get executed. This option is required.
-   **timeout**: The amount of time the check should require in ms. Default is 1000 which is equivalent to 1 second.
-   **memoryThreshold**: The maximum amount of memory that the Redis server expects to use in bytes.

### Cluster

```TypeScript
interface checkHealth {
    (key: string, options: { type: 'cluster'; client: Cluster }): Promise<HealthIndicatorResult>;
}
```

-   **key**: The key which will be used for the result object.
-   **type**: Server type. You must specify what Redis server type you use. Possible values are "redis", "cluster". This option is required.
-   **client**: The client which the health check should get executed. This option is required.
