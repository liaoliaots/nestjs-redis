# Health Checks

## Usage

**1**, we need to install the required package:

```sh
$ npm install --save @nestjs/terminus
```

**2**, import the `TerminusModule` and `RedisHealthModule` into the business module:

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule, RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis/health'; // note the path
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';

// Suppose we want to check health for redis and cluster, so we need to import the `ClusterModule` and `RedisModule`.

@Module({
    imports: [
        ClusterModule.forRoot({
            config: {
                nodes: [{ host: 'localhost', port: 16380 }],
                options: { redisOptions: { password: 'cluster1' } }
            }
        }),
        RedisModule.forRoot({
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

> HINT: Both `TerminusModule` and `RedisHealthModule` aren't global modules.

**3**, let's create a health check:

```TypeScript
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { InjectRedis, InjectCluster } from '@liaoliaots/nestjs-redis';
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis/health'; // note the path
import { Redis, Cluster } from 'ioredis';

@Controller()
export class AppController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly redisIndicator: RedisHealthIndicator,
        @InjectRedis() private readonly redis: Redis,
        @InjectCluster() private readonly cluster: Cluster
    ) {}

    @Get('health')
    @HealthCheck()
    async healthChecks(): Promise<HealthCheckResult> {
        return await this.health.check([
            () => this.redisIndicator.checkHealth('redis', { client: this.redis }),
            () => this.redisIndicator.checkHealth('cluster', { client: this.cluster })
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

> INFO: Read more about `@nestjs/terminus` [here](https://docs.nestjs.com/recipes/terminus).
