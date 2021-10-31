# Health Checks

## Usage

**Firstly**, we need to install the required package:

```sh
$ npm install --save @nestjs/terminus
```

**Secondly**, we need to import the `TerminusModule` and `RedisHealthModule` into our business module:

```TypeScript
import { Module } from '@nestjs/common';
import { ClusterModule, RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis/health'; // note the import path
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';

// Suppose we want to check health for redis and cluster, so we need to import the `ClusterModule` and `RedisModule`.

@Module({
    imports: [
        ClusterModule.forRoot({
            closeClient: true,
            config: {
                nodes: [{ host: '127.0.0.1', port: 16380 }],
                options: { redisOptions: { password: 'clusterpassword1' } }
            }
        }),
        RedisModule.forRoot({
            closeClient: true,
            config: {
                host: '127.0.0.1',
                port: 6380,
                password: 'masterpassword1'
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

**Now** let's create a health check:

```TypeScript
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { InjectRedis, InjectCluster } from '@liaoliaots/nestjs-redis';
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis/health'; // note the import path
import { Redis, Cluster } from 'ioredis';

@Controller()
export class AppController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly redis: RedisHealthIndicator,
        @InjectRedis() private readonly defaultRedisClient: Redis,
        @InjectCluster() private readonly defaultClusterClient: Cluster
    ) {}

    @Get('health')
    @HealthCheck()
    async healthChecks(): Promise<HealthCheckResult> {
        return await this.health.check([
            () => this.redis.checkHealth('default-redis-client', { client: this.defaultRedisClient }),
            () => this.redis.checkHealth('default-cluster-client', { client: this.defaultClusterClient })
        ]);
    }
}

```

If your redis and cluster are reachable, you should now see the following JSON-result when requesting http://localhost:3000/health with a GET request:

```json
{
    "status": "ok",
    "info": {
        "default-redis-client": {
            "status": "up"
        },
        "default-cluster-client": {
            "status": "up"
        }
    },
    "error": {},
    "details": {
        "default-redis-client": {
            "status": "up"
        },
        "default-cluster-client": {
            "status": "up"
        }
    }
}
```

> INFO: Read more about `@nestjs/terminus` [here](https://docs.nestjs.com/recipes/terminus).
